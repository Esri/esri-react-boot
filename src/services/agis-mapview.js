import * as esriLoader from 'esri-loader';

function initView(mapOptions, mapViewOptions, node) {
  return new Promise((resolve, reject) => {
    esriLoader.loadModules([
      'esri/Map',
      'esri/views/MapView'
    ])
    .then( ([Map, MapView]) => {

      // const webMapOptions = Object.assign({},
      //   {
      //     portalItem: {
      //       id: webmapId
      //     }
      //   }
      // );

      const map = new Map({
          basemap: "streets"
      });

      new MapView({
          container: node,
          map: map,
          zoom: 4,
          center: [15, 65]
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

export function createView(mapOptions, mapViewOptions, node) {
  return new Promise((resolve, reject) => {
    if (!esriLoader.isLoaded()) {
      reject('JSAPI is not yet loaded');
      return;
    }

    initView(mapOptions, mapViewOptions, node).then(
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

export function startup(mapOptions, mapViewOptions, node) {

  createView(mapOptions, mapViewOptions, node).then(
    result => {
      init(result);
      setupEventHandlers(map);
      setupWidgetsAndLayers();
      //finishedLoading();
    },
    error => {
      console.error("maperr", error);
      window.setTimeout(()=>{
        startup(mapOptions, mapViewOptions, node);
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
