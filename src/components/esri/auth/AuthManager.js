// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// Esri Loader
import { loadModules } from 'esri-loader';
// Esri Helper Functions
import { bootstrapJSAPI } from '../../../utils/esriHelper';

/**
 * Class to help with Authentication
 * This is a non-rendered class that is usually attached to the window
 * @type {Class}
 */
export default class AuthManager {
  constructor(appId, portalUrl, jsapiUrl, jsapiV4, loginWithPopup) {
    this.appId = appId;
    this.portalUrl = portalUrl;
    this.jsapiUrl = jsapiUrl;
    this.jsapiV4 = jsapiV4;
    this.loginWithPopup = loginWithPopup;
  }

  /**
   * Use this to start up the JS API via the AuthManager class
   * @return {Promise} Resolves if there is no portal url, which means no login required
   *                   or there is a portal url and the IdentityManager is setup correctly
   */
  startup = () => {
    return new Promise((resolve, reject) => {
      bootstrapJSAPI(this.portalUrl, this.jsapiUrl, this.jsapiV4)
        .then(success => {
          // Check if we need to authenticate
          if (!this.portalUrl) {
            return resolve();
          }
          // If we need authentication then set up IDManager
          this.createIDManager().then(resolve());
        })
        .catch(err => {
          reject();
        });
    });
  };

  /**
   * Method to create Esri JS API IdentityManager
   * This is called in startup but can be called independently if needed
   * @return {Promise} Resolves after IdentityManager is setup
   */
  createIDManager = () => {
    return new Promise((resolve, reject) => {
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
      })
      .catch(err => {
        reject();
      });
    })
  };

  /**
   * Main login function
   * This will see if the user has persistent login info
   * and if not it will run the login method
   * @param  {string}   [portalUrl=this.portalUrl]   will default to config portalUrl
   * @return {Promise}                               will resolve if user is logged in or
   *                                                 conditions are met on portal url
   */
  login = (portalUrl = this.portalUrl) => {
    return new Promise((resolve, reject) => {
      this.checkLogin().then(
        success => {
          this.getUser().then(resolve, reject);
        },
        failed => {
          let persistObj = this.checkPersist();

          if (!this.idManager && persistObj && persistObj.portalUrl) {
            // if there is persistent login info grab that portal url
            this.portalUrl = persistObj.portalUrl;
          } else if (portalUrl) {
            // if a portal url was passed in as a param grab that
            this.portalUrl = portalUrl;
          } else {
            // no portal, we don't need to login and can return
            return resolve();
          }

          // use the aquired portal url to setup a new ID Manager and login
          this.createIDManager().then(() => {
            this.doLogin().then(user => resolve(user), error => reject(error));
          });
        }
      );
    });
  };

  /**
   * Check if user is logged in already via persistent login info
   * @return {Promise} will reject if no portal url or there is a login/user info error
   */
  checkLogin = () => {
    return new Promise((resolve, reject) => {
      // Reject this if there is no portal URL in the config file
      if (!this.portalUrl) {
        return reject();
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

  /**
   * Method for login process
   * @return {Promise} Resolves if we user info from login
   */
  doLogin = () => {
    // we can store the portal url here so the browser rememebers us on refresh
    this.persistAuth();

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

  /**
   * Get user info, part of login process
   * @return {Promise} Resolves once we get user info
   */
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

  /**
   * Method to store the login info
   */
  persistAuth = () => {
    // persist auth to a cookie for cross-page goodness
    const json = this.idManager.toJSON();
    localStorage.setItem('esri_auth_id', JSON.stringify(json));
  };

  /**
   * Get method for the stored login info
   * @return {Object} The login info object, can be null
   */
  checkPersist = () => {
    let persistObj = JSON.parse(localStorage.getItem('esri_auth_id'));

    if (persistObj && persistObj.oAuthInfos) {
      return persistObj.oAuthInfos[0];
    }

    return null;
  }

  /**
   * Method for logging out
   */
  logout = () => {
    loadModules(['dojo/cookie']).then(([cookie]) => {
      cookie('esri_auth', '{esri: "logout"}', {
        expire: -1,
        expires: -1,
        path: '/'
      });
      localStorage.removeItem('esri_auth_id');
      this.idManager.destroyCredentials();
    });
  };
}
