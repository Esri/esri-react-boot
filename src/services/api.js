/**
 * Some general functions to help with requests
 */

import { makeRequest } from "./request";

export function getAppConfig() {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `/config.json`,
      method: "get"
    }).then(resp => resolve(resp));
  });
}

export function logout(portalUrl) {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `${portalUrl}/sharing/rest/oauth2/signout`,
      handleAs: "text"
    }).then(resp => resolve(resp), error => reject(error));
  });
}
