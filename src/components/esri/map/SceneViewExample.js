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

// NOTE
// This is a "special" react component that does not strictly play by
// React's rules.
//
// Conceptually, this component creates a "portal" in React by
// closing its render method off from updates (by simply rendering a div and
// never accepting re-renders) then reconnecting itself to the React lifecycle
// by listening for any new props (using componentWillReceiveProps)

// React
import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../../../redux/reducers/map';

// ESRI
import { loadModules } from 'esri-loader';
import { createView } from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

// Variables
const containerID = "map-view-container";

class SceneViewExample extends Component {

  componentDidMount() {
    this.startup(
      this.props.mapConfig,
      containerID,
      this.props.is3DScene
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Tell React to never update this component, that's up to us
    return false;
  }

  render() {
    return (
      <Container ref="mapDiv" id={containerID}></Container>
    );
  }

  // ESRI JSAPI
  startup = (mapConfig, node, isScene = false) => {
    createView(mapConfig, node, isScene).then(
      response => {
        this.init(response);
        this.setupEventHandlers(this.map);
        this.setupWidgetsAndLayers();
        this.finishedLoading();
      },
      error => {
        console.error("maperr", error);
        window.setTimeout( () => {
          this.startup(mapConfig, node);
        }, 1000);
      })
  }

  finishedLoading = () => {
    // Update app state only after map and widgets are loaded
    this.props.onMapLoaded();
  }

  init = (response) => {
    this.view = response.view
    this.map = response.view.map;
  }

  setupWidgetsAndLayers = () => {
    loadModules([
      'esri/layers/FeatureLayer',
      'esri/widgets/LayerList',
      'esri/core/Collection',
    ])
    .then( ([
      FeatureLayer,
      LayerList,
      Collection,
    ]) => {
      const featureLayer = new FeatureLayer({
        outFields: ["STATION_NAME", "COUNTRY", "TEMP"],
        portalItem: { // autocasts as new PortalItem()
          id: "3a177da3f6524d61980fb41125b2349c"
        },
        title: "Temperature on Jan, 4, 2017"
      });
      this.map.add(featureLayer);

      // When the layer is loaded, query for the extent
      // of all features in the layer that satisfy the
      // definitionExpression. Then set the view's
      // extent to the returned extent of all features.

      featureLayer.when(function() {
        featureLayer.definitionExpression = createDefinitionExpression(
          "");
        zoomToLayer(featureLayer);
      });

      const layerList = new LayerList({
        view: this.view,
        listItemCreatedFunction: createActions
      });
      this.view.ui.add(layerList, "top-right");

      // definitionExpressions used by each action
      // listed in the LayerList

      const expressions = new Collection([{
        id: "75+",
        expression: "TEMP > 75"
      }, {
        id: "50-75",
        expression: "TEMP > 50 AND TEMP <=75"
      }, {
        id: "25-50",
        expression: "TEMP > 25 AND TEMP <=50"
      }, {
        id: "25-",
        expression: "TEMP <= 25"
      }, {
        id: "arctic-circle",
        expression: "LATITUDE >= 66.5"
      }, {
        id: "north-temperate-zone",
        expression: "LATITUDE < 66.5 AND LATITUDE >= 23.5"
      }, {
        id: "torrid-zone",
        expression: "LATITUDE < 23.5 AND LATITUDE >= -23.5"
      }]);

      // When an action is triggered, the definitionExpression
      // is set on the layer and the view's extent updates
      // to match the features visible in the layer

      layerList.on("trigger-action", function(event) {

        const actionId = event.action.id;
        const layer = event.item.layer;

        const subExpression = expressions.find(function(item) {
          return item.id === actionId;
        }).expression;

        const definitionExpression = createDefinitionExpression(
          subExpression);
        layer.definitionExpression = definitionExpression;

        zoomToLayer(layer);
      });

      function createActions(event) {
        const item = event.item;

        item.actionsOpen = true;
        item.actionsSections = [
          [{
            title: "> 75°F",
            className: "esri-icon-zoom-out-fixed",
            id: "75+"
          }, {
            title: "50°-75°F",
            className: "esri-icon-zoom-out-fixed",
            id: "50-75"
          }, {
            title: "25°-50°F",
            className: "esri-icon-zoom-out-fixed",
            id: "25-50"
          }, {
            title: "< 25°F",
            className: "esri-icon-zoom-out-fixed",
            id: "25-"
          }],
          [{
            title: "Above Arctic Circle",
            className: "esri-icon-zoom-out-fixed",
            id: "arctic-circle"
          }, {
            title: "North Temperate Zone",
            className: "esri-icon-zoom-out-fixed",
            id: "north-temperate-zone"
          }, {
            title: "Torrid Zone",
            className: "esri-icon-zoom-out-fixed",
            id: "torrid-zone"
          }]
        ];
      }

      // Appends a definitionExpression to a base expression
      // the base expression only returns freatures in
      // Canada, USA, and Mexico. It excludes some US territories
      // located on the other side of the dateline

      function createDefinitionExpression(subExpression) {
        const baseExpression =
          "( COUNTRY LIKE '%United States Of America%' OR " +
          "COUNTRY LIKE '%Canada%' OR " +
          "COUNTRY LIKE '%Mexico%') AND NOT" +
          "(COUNTRY LIKE '%Johnston/Wake/Xmas%' OR " +
          "COUNTRY LIKE '%Hawaii%' OR " +
          "COUNTRY LIKE '%Marshall Islands%' OR " +
          "STATION_NAME = 'Eareckson/Shemya' OR " +
          "COUNTRY LIKE '%Guam%' )";

        return subExpression ? baseExpression + " AND (" + subExpression +
          ")" : baseExpression;
      }

      // Zooms to the extent of the layer as defined by
      // its definitionExpression
      // This method will work for all FeatureLayers, even
      // those without a saved `fullExtent` on the service.

      const zoomToLayer = (layer) => {
        return layer.queryExtent()
          .then((response) => {
            this.view.goTo(response.extent);
          });
      }
    });
  }

  setupEventHandlers = (map) => {
    loadModules([

    ], (

    ) => {

      //
      // JSAPI Map Event Handlers go here!
      //

    });
  }
}

const mapStateToProps = state => ({
  config: state.config,
  map: state.map
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (SceneViewExample);
