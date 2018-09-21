import * as esriLoader from 'esri-loader';

function initView(node, webmapId, viewOptions) {
  return new Promise((resolve, reject) => {
    esriLoader.loadModules([
      'esri/WebScene',
      'esri/views/SceneView',
    ])
    .then( ([WebScene, SceneView]) => {

      const webMapOptions = Object.assign({},
        {
          portalItem: {
            id: webmapId
          }
        }
      );

      let  webmap = new WebScene(
        webMapOptions
      );

      new SceneView({
        map: webmap,
        container: node,
        ...viewOptions
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

export function createView(node, webmapId, viewOptions) {
  return new Promise((resolve, reject) => {
    if (!esriLoader.isLoaded()) {
      reject('JSAPI is not yet loaded');
      return;
    }

    initView(node, webmapId, viewOptions).then(
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

export function startup(webmapId, mapOptions, user) {
  const node = "viewContainer";

  createView(node, webmapId, mapOptions).then(
    result => {
      init(result);
      setupEventHandlers(map);
      setupWidgetsAndLayers();
      //finishedLoading();
    },
    error => {
      console.error("maperr", error);
      window.setTimeout(()=>{
        startup(this.props.appConfig.webmapId, this.props.appConfig.mapOptions, this.props.user);
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
