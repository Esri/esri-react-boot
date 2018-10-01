import * as esriLoader from 'esri-loader';

function initView(mapConfig, node) {
    // if there is a portal ID then this is a web map
    console.log('initView: ', mapConfig);
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

                console.log('parsing extent: ', mapConfig.extent);

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

export function createView(mapConfig, node) {
    return new Promise((resolve, reject) => {
        if (!esriLoader.isLoaded()) {
            reject('JSAPI is not yet loaded');
            return;
        }

        initView(mapConfig, node).then(
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

export function startup(mapConfig, node, features) {
    createView(mapConfig, node).then(
        result => {
            init(result);
            setupEventHandlers(map);
            console.log('adding features: ', features);
            setupWidgetsAndLayers(features);
            //finishedLoading();
        },
        error => {
            console.error("maperr", error);
            window.setTimeout(()=>{
                startup(mapConfig, node);
            }, 1000);
        }
    )
}

// function finishedLoading() {
//   // Update app state only after map and widgets are loaded
//   this.props.onMapLoaded();
// }

function init(args) {
    //view = args.view
    map = args.view.map;
}

function setupWidgetsAndLayers(features) {
    esriLoader.loadModules([
        'dojo/on',
        'esri/layers/FeatureLayer'
    ]).then( ([
        on,
        FeatureLayer,
    ]) => {
        if (features && features.length > 0) {
            features.forEach(function(featureLayer) {
                console.log('trying to add layer: ', featureLayer);
                let fl = new FeatureLayer({
                    url: featureLayer
                });
                map.add(fl);
            });
        }
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
