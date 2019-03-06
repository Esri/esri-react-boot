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
import * as esriLoader from 'esri-loader';

/**
 * Load in the Esri JSAPI using parameters from the app's configuration
 * @param  {string}   portalUrl  Portal URL from public/config
 * @param  {string}   jsapiUrl   JSAPI URL from public/config
 * @param  {bool}     jsapiV4    Flag for Esri JSAPI 4.x
 * @return {Promise}             Returns a promise for async
 */
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

export function createView(mapConfig, node, isScene = false) {
    return new Promise((resolve, reject) => {
        if (!esriLoader.isLoaded()) {
            reject('JSAPI is not yet loaded');
            return;
        }

        if (isScene) {
          initScene(mapConfig, node).then(
              response => {
                resolve(response);
              },
              error => {
                  reject(error);
              }
          );
        } else {
          initMap(mapConfig, node).then(
              response => {
                  resolve(response);
              },
              error => {
                  reject(error);
              }
          );
        }
    });
}

function initMap(mapConfig, node) {
    // if there is a portal ID then this is a web map
    if (mapConfig.id) {
        return new Promise((resolve, reject) => {
            esriLoader.loadModules([
                'esri/WebMap',
                'esri/views/MapView',
                'esri/geometry/Extent'
            ]).then( ([WebMap, MapView, Extent]) => {

                const webmap = new WebMap({
                    portalItem: {
                        id: mapConfig.id
                    }
                });

                new MapView({
                    container: node,
                    map: webmap,
                    extent: mapConfig.extent
                }).when(
                    response => {
                        resolve({
                            view: response,
                        });
                    },
                    error => {
                        reject(error);
                    }
                );
            });
        });
    }
    // else if there is no portal ID then we return the default map view
    return new Promise((resolve, reject) => {
        esriLoader.loadModules([
            'esri/Map',
            'esri/views/MapView'
        ]).then( ([Map, MapView]) => {

            const map = new Map({
                basemap: mapConfig.basemap
            });

            new MapView({
                container: node,
                map: map,
                zoom: mapConfig.zoom,
                center: mapConfig.center
            }).when(
                response => {
                    resolve({
                        view: response,
                    });
                },
                error => {
                    reject(error);
                }
            );
        });
    });
}

function initScene(mapConfig, node) {
    // if there is a portal ID then this is a web scene
    if (mapConfig.id) {
        return new Promise((resolve, reject) => {
            esriLoader.loadModules([
                'esri/WebScene',
                'esri/views/SceneView',
            ]).then( ([WebScene, SceneView]) => {

                let webmap = new WebScene({
                    portalItem: {
                        id: mapConfig.id
                    }
                });

                new SceneView({
                    map: webmap,
                    container: node
                }).when(
                    response => {
                        resolve({
                            view: response,
                        });
                    },
                    error => {
                        reject(error);
                    }
                )
            });
        });
    }
    // else if there is no portal ID then we return the default scene view
    return new Promise((resolve, reject) => {
        esriLoader.loadModules([
            'esri/Map',
            'esri/views/SceneView'
        ]).then( ([Map, SceneView]) => {

            const map = new Map({
                basemap: mapConfig.basemap
            });

            new SceneView({
                container: node,
                map: map
            }).when(
                response => {
                    resolve({
                        view: response,
                    });
                },
                error => {
                    reject(error);
                }
            );
        });
    });
}
