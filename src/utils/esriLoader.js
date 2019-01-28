import * as esriLoader from 'esri-loader';

export function bootstrapJSAPI(portalUrl, jsapiUrl, jsapiV4) {
  return new Promise((resolve, reject) => {
    if (esriLoader.isLoaded()) {
      resolve();
      return;
    }

    const options = {
      url: jsapiUrl
    };

    esriLoader
      .loadScript(options)
      .then(() => {
        initApi(portalUrl, jsapiV4).then(
          success => resolve(),
          error => reject(error)
        );
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function createView(node, webmapId) {
  return new Promise((resolve, reject) => {
    if (!esriLoader.isLoaded()) {
      reject('JSAPI is not yet loaded');
      return;
    }

    initView(node, webmapId).then(
      response => {
        resolve(response);
      },
      error => {
        reject(error);
      }
    );
  });
}

function initApi(portalUrl, jsapiV4) {
  return new Promise((resolve, reject) => {
    if (jsapiV4 && portalUrl) {
      esriLoader
        .loadModules(['esri/identity/IdentityManager'])
        .then(([IdentityManager]) => {
          resolve();
        });
    } else if (!jsapiV4 && portalUrl) {
      esriLoader
        .loadModules(['esri/IdentityManager', 'esri/arcgis/utils'])
        .then(([IdentityManager, arcgisUtils]) => {
          arcgisUtils.arcgisUrl = `${portalUrl}/sharing/rest/content/items`;
          resolve();
        });
    } else if (!portalUrl) {
      resolve();
    }
  });
}

function initView(node, webmapId) {
  return new Promise((resolve, reject) => {
    esriLoader
      .loadModules([
        'esri/WebMap',
        'esri/views/MapView',
        'esri/widgets/BasemapToggle'
      ])
      .then(([WebMap, MapView, BasemapToggle]) => {
        const webmap = new WebMap({
          portalItem: {
            // autocasts as new PortalItem()
            id: webmapId
          }
        });

        new MapView({
          map: webmap,
          container: node
        }).when(
          response => {
            resolve({ view: response, webmap });
          },
          error => {
            reject(error);
          }
        );
      });
  });
}
