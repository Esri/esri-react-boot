import { loadModules } from 'esri-loader';
import { bootstrapJSAPI } from '../../../utils/esriHelper';

export default class AuthManager {
  constructor(appId, portalUrl, jsapiUrl, jsapiV4, loginWithPopup) {
    this.appId = appId;
    this.portalUrl = portalUrl;
    this.jsapiUrl = jsapiUrl;
    this.jsapiV4 = jsapiV4;
    this.loginWithPopup = loginWithPopup;
  }

  startup = () => {
    return new Promise((resolve, reject) => {
      bootstrapJSAPI(this.portalUrl, this.jsapiUrl, this.jsapiV4)
        .then(success => {
          // Check if we need to authenticate
          if (!this.portalUrl) {
            resolve();
            return;
          }
          // If we need authentication then set up IDManager
          loadModules([
            'esri/identity/IdentityManager',
            'esri/identity/OAuthInfo'
          ]).then(([esriId, OAuthInfo]) => {
            this.idManager = esriId;

            const esriAuthID = localStorage.getItem('esri_auth_id');
            if (esriAuthID) {
              // if auth was persisted, just use that
              this.idManager.initialize(esriAuthID);
            } else {
              this.idManager.useSignInPage = !this.loginWithPopup;
              this.oAuthInfo = new OAuthInfo({
                appId: this.appId,
                portalUrl: this.portalUrl,
                popup: this.loginWithPopup
              });
              this.idManager.registerOAuthInfos([this.oAuthInfo]);
            }

            resolve();
          });
        })
        .catch(err => {
          reject();
        });
    });
  };

  login = () => {
    return new Promise((resolve, reject) => {
      this.checkLogin().then(
        success => {
          // resolve without user info if we are skipping auth
          if (!this.portalUrl) {
            resolve();
          }

          this.getUser().then(resolve, reject);
        },
        failed => {
          this.doLogin().then(user => resolve(user), error => reject(error));
        }
      );
    });
  };

  checkLogin = () => {
    return new Promise((resolve, reject) => {
      // skip check if login not needed
      if (!this.portalUrl) {
        resolve();
        return;
      }

      const sharingUrl = this.portalUrl + '/sharing';

      this.idManager
        .checkSignInStatus(sharingUrl)
        .then(credential => {
          this.persistAuth();
          this.getUser().then(resolve, reject);
        })
        .otherwise(e => {
          reject('User is not logged in');
        });
    });
  };

  doLogin = () => {
    return new Promise((resolve, reject) => {
      const sharingUrl = this.portalUrl + '/sharing';

      this.idManager
        .getCredential(sharingUrl, { oAuthPopupConfirmation: false })
        .then(credential => {
          this.getUser().then(resolve, reject);
        })
        .otherwise(reject);
    });
  };

  getUser = () => {
    return new Promise((resolve, reject) => {
      loadModules(['esri/portal/Portal']).then(([Portal]) => {
        let portal = new Portal({
          url: this.portalUrl,
          authMode: 'immediate'
        });
        portal
          .load()
          .then(() => {
            this.user = portal.user;
            this.user
              .fetchGroups()
              .then(
                resolve(this.user)
              )
              .otherwise(reject);
          })
          .otherwise(reject);
      });
    });
  };

  persistAuth() {
    // persist auth to a cookie for cross-page goodness
    const json = this.idManager.toJSON();
    localStorage.setItem('esri_auth_id', JSON.stringify(json));
  }

  logout = () => {
    loadModules(['dojo/cookie']).then(([cookie]) => {
      cookie('esri_auth', '{observer: "logout"}', {
        expire: -1,
        expires: -1,
        path: '/'
      });
      this.idManager.destroyCredentials();

      // this works for both internal and outside users, whereas signing out of
      // generic arcgis.com only works for outside users.
      window.api.logout().then(
        success => {
          window.location.reload();
        },
        error => {
          console.error(error);
        }
      );
    });
  };
}
