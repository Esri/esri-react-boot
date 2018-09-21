import { makeRequest } from './request';

export function setApiUrl(url) {
    this.props.apiUrl = url;
}

export function setPortalUrl(url) {
    this.props.portalUrl = url;
}


export function setAuth(user) {
    this.props.user = user;
}

export function getToken() {
    return this.props.user.credential.token;
}

export function getUsername() {
    return this.props.user.username;
}

export function getPortalUrl() {
    return this.props.portalUrl;
}


export function getApiUrl() {
    return `${window.location.protocol}//${window.location.host}${this.basename}/${this.props.apiUrl}`;
}

export function getAppConfig() {
    return new Promise((resolve, reject) => {
        makeRequest({
            url: `/config.json`,
            method: 'get'
        }).then(resp => resolve(resp));
    });
}

export function getAppStrings() {
    return new Promise((resolve, reject) => {
        this.request.makeRequest({
            url: `${this.basename}/strings.json`,
            method: 'get'
        }).then(resp => resolve(resp));
    });
}

export function getUserGroups() {
    return new Promise((resolve, reject) => {
        this.request.makeRequest({
            url: `${this.getPortalUrl()}/sharing/rest/community/users/${this.getUsername()}`,
            method: 'post',
            data: { f: 'json', token: this.getToken() }
        }).then(
            resp => resolve(resp),
            error => reject(error)
        )
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
