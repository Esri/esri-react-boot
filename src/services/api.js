import { makeRequest } from './request';

export function getAppConfig() {
    return new Promise((resolve, reject) => {
        makeRequest({
            url: `/config.json`,
            method: 'get'
        }).then(resp => resolve(resp));
    });
}

export function logout() {
    return new Promise((resolve, reject) => {
        this.request.makeRequest({
            url: `${this.getPortalUrl()}/sharing/rest/oauth2/signout`,
            handleAs: 'text'
        }).then(
            resp => resolve(resp),
            error => reject(error)
        );
    });
}
