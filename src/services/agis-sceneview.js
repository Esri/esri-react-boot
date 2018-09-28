import * as esriLoader from 'esri-loader';

function initView(mapConfig, user, node) {
    // if there is a portal ID then this is a web map
    if (mapConfig.id) {
        return new Promise((resolve, reject) => {
            esriLoader.loadModules([
                'esri/WebScene',
                'esri/views/SceneView',
            ]).then( ([WebScene, SceneView]) => {

                let  webmap = new WebScene({
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
    // else if there is no portal ID then we return the default map view
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

export function createView(mapConfig, user, node) {
    return new Promise((resolve, reject) => {
        if (!esriLoader.isLoaded()) {
            reject('JSAPI is not yet loaded');
            return;
        }

        initView(mapConfig, user, node).then(
            response => {
                resolve(response);
            },
            error => {
                reject(error);
            }
        );
    });
}

//
// JSAPI Stuff
//
//let view;
let map;

export function startup(mapConfig, user, node) {

  createView(mapConfig, user, node).then(
    result => {
      init(result);
      setupEventHandlers(map);
      setupWidgetsAndLayers();
      //finishedLoading();
    },
    error => {
      console.error("maperr", error);
      window.setTimeout(()=>{
        startup(mapConfig, user, node);
      }, 1000);
    })
}

// function finishedLoading() {
//   // Update app state only after map and widgets are loaded
//   this.props.onMapLoaded();
// }

function init(args) {
  //view = args.view
  map = args.view.map;
}

function setupWidgetsAndLayers() {
  esriLoader.loadModules([
    'dojo/on',
  ])
  .then( ([
    on,
  ]) => {

  });
}

function setupEventHandlers(map) {
  esriLoader.loadModules([
    'dojo/on',
    'dojo/topic'
  ], (
    on,
    topic
  ) => {

    //
    // JSAPI Map Event Handlers go here!
    //

  });
}
