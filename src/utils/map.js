import { loadModules } from "esri-loader";

export function loadMap(element, mapOptions) {
  return loadModules(["esri/Map", "esri/views/MapView"], {
    css: true
  }).then(([Map, MapView]) => {
    if (!element) {
      // component or app was likely destroyed
      return;
    }
    // create the Map
    const map = new Map(mapOptions);
    // show the map at the element
    let view = new MapView({
      map,
      container: element,
      ...mapOptions
    });
    // wait for the view to load TODO: may not need this?
    return view.when(() => {
      // return a reference to the view
      return view;
    });
  });
}
