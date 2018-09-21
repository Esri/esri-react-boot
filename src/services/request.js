
//export default class Request {
  export function constructor(token) {
    this.token = token;
  }

  export function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  export function handleResponse(handleAs, response) {
    switch (handleAs) {
      case 'text':
        return response.text();
      default:
        return response.json();
    }
  }

  export function addArrayToFormData(propName, propArray, formData) {
    propArray.forEach(value => {
      formData.append(propName, value);
    });
  }

  export function objectToFormData(obj) {
    const body = new FormData();
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (Array.isArray(obj[prop])) {
          this.addArrayToFormData(prop, obj[prop], body);
        } else {
          body.append(prop, obj[prop]);
        }
      }
    }

    // Add 'f=json' (we used to only add if it didn't already exist, but IE)
    body.append('f', 'json');

    return body;
  }

  export function objectToUrlSearchParams(obj) {
    const body = new URLSearchParams();
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        body.append(prop, obj[prop]);
      }
    }

    // add f=json if not included
    if (!body.has('f')) {
      body.append('f', 'json');
    }

    return body.toString();
  }

  export function getHeaders(isFormData) {
    const headers = {};

    if (!isFormData) {
      headers['content-type'] = 'application/x-www-form-urlencoded';
    }

    return new Headers(headers);
  }

  export function getRequestBody(data, isFormData) {
    // if formdata, make formdata
    if (isFormData) {
      return this.objectToFormData(data);
    }

    // Not formdata, make url param
    return objectToUrlSearchParams(data);
  }

  /**
   * Make a request using fetch()
   * @param  { Object } params Object containing key/value parameters to pass to fetch()
   * @return { Promise}        Promise returned by fetch()
   */
  export function makeRequest(params) {
    return new Promise((resolve, reject) => {
      let url = params.url;
      const data = params.data || {};
      const headers = getHeaders(params.isFormData);
      const options = {
        method: params.method || 'get',
        headers
      };

      if (!params.hideCredentials) {
        options.credentials = 'include';
      }

      let body = getRequestBody(data, params.isFormData);

      if (options.method === 'get') {
        url = `${url}?${body}`;
      } else {
        options.body = body;
      }

      fetch(url, options)
      .then(status)
      .then(handleResponse.bind(null, params.handleAs))
      .then(function(data) {
        // Handle successful requests that are actually errors...
        if (data.error) {
          reject(data.error);
          return;
        }
        resolve(data);
      }).catch(function(error) {
        reject(error);
      });
    });
  }
//}
