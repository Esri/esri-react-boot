import * as esriLoader from 'esri-loader';

// GLOBAL VARIABLES //
let IDManager = null;
let appConfig = null;

// PUBLIC FUNCTIONS //
export function startup(config) {
    appConfig = config;

    return new Promise((resolve, reject) => {
        bootstrapJSAPI(config.portalUrl, config.jsapiUrl, config.jsapiV4)
        .then(success => {
            if(config.jsapiV4){
                esriLoader.loadModules([
                    'esri/identity/IdentityManager', 'esri/identity/OAuthInfo'
                ])
                .then( ([IdentityManager, OAuthInfo]) => {
                    IDManager = IdentityManager;
                    IDManager.useSignInPage = !config.loginWithPopup;
                    const oAuthInfo = new OAuthInfo({
                        appId: config.appId,
                        portalUrl: config.portalUrl,
                        popup: config.loginWithPopup
                    });
                    IDManager.registerOAuthInfos([oAuthInfo]);
                    resolve(IDManager);
                });
            } else {
                // TODO this is repeated from above (??)
                esriLoader.loadModules([
                    'esri/identity/IdentityManager', 'esri/identity/OAuthInfo'
                ])
                .then( ([IdentityManager, OAuthInfo]) => {
                    IDManager = IdentityManager;
                    IDManager.useSignInPage = !config.loginWithPopup;
                    const oAuthInfo = new OAuthInfo({
                        appId: config.appId,
                        portalUrl: config.portalUrl,
                        popup: config.loginWithPopup
                    });
                    IDManager.registerOAuthInfos([oAuthInfo]);
                    resolve(IDManager);
                });
            }
        })
        .catch(err => { reject(); });
    });
}

export function login(mgmt) {
    return new Promise((resolve, reject) => {
        checkLogin(mgmt).then(
            success => {
                getUser().then(resolve, reject);
            },
            failed => {
                doLogin().then(user => resolve(user), error => reject(error));
            }
        )
    });
}

export function bootstrapJSAPI(portalUrl, jsapiUrl, jsapiV4) {
    return new Promise((resolve, reject) => {
        if (esriLoader.isLoaded()) {
            resolve();
            return;
        }

        const options = {
            url: jsapiUrl
        };

        esriLoader.loadScript(options)
        .then( () => {
            initApi(portalUrl,jsapiV4).then(
                success => resolve(),
                error => reject(error)
            );
        })
        .catch(err => {
        reject(err);
        });
    });
}


// PRIVATE FUNCTIONS //
function checkLogin(mgmt) {
    return new Promise((resolve, reject) => {
        const sharingUrl = appConfig.portalUrl + '/sharing';

        mgmt.checkSignInStatus(sharingUrl)
        .then(credential => {
            getUser().then(resolve, reject);
        })
        .otherwise(() => {
            reject('User is not logged in');
        });
    });
}

function doLogin() {
    return new Promise((resolve, reject) => {
        const sharingUrl = appConfig.portalUrl + '/sharing';

        IDManager.getCredential(sharingUrl, {oAuthPopupConfirmation: false}).then((credential) => {
            getUser().then(resolve, reject);
        }).otherwise(reject)
    });
}

function getUser() {
    return new Promise((resolve, reject) => {
        if(appConfig.jsapiV4) {
            esriLoader.loadModules(['esri/portal/Portal'])
            .then( ([Portal]) => {
                let portal = new Portal({
                    url: appConfig.portalUrl,
                    authMode: "immediate"
                });
                portal.load().then(() => {
                    //this.user = portal.user;
                    resolve(portal.user);
                }).otherwise(reject)
            });
        } else {
            esriLoader.loadModules(['esri/arcgis/Portal'])
            .then( ([arcgisPortal]) => {
                new arcgisPortal.Portal(this.portalUrl).signIn().then(user => {
                    this.user = user;
                    resolve(user);
                }).otherwise(reject)
            });
        }
    });
}

// TODO - NOT IN USE //
// function logout() {
//     esriLoader.loadModules(['dojo/cookie'])
//     .then( ([cookie]) => {
//         // dojo cookies hates me
//         cookie('esri_auth', '{platbuilder: "logout"}', {
//             expire: -1,
//             expires: -1,
//             path: '/'
//         });
//         this.idManager.destroyCredentials();
//
//         // it seems strange to sign out of eaglei even for outside org users,
//         // but this works for both eaglei and outside users, whereas signing out of
//         // generic arcgis.com only works for outside users.
//         window.api.logout().then(
//             success => {
//                 window.location.reload();
//             },
//             error => {
//                 console.error(error);
//             }
//         )
//     });
// }
//
// function getToken() {
//     return this.idManager.findCredential(this.portalUrl, this.user.username).token;
// }

function initApi(portalUrl, jsapiV4) {
    return new Promise((resolve, reject) => {
        if(jsapiV4){
            esriLoader.loadModules(['esri/identity/IdentityManager'])
            .then( ([IdentityManager]) => {
                resolve();
            });
        } else {
            esriLoader.loadModules([
                'esri/IdentityManager',
                'esri/arcgis/utils'
            ])
            .then ( ([IdentityManager, arcgisUtils]) => {
                arcgisUtils.arcgisUrl = `${portalUrl}/sharing/rest/content/items`;
                resolve();
            });
        }
    });
}
