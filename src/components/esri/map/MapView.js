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
const containerID = 'map-view-container';

class MapView extends Component {

    componentDidMount() {
        console.log(this.props.mapConfig);
        this.startup(
          this.props.mapConfig,
          containerID,
          this.props.features
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Tell React to never update this component, that's up to us
        return false;
    }

    render() {
        return (
            <Container ref="mapDiv" id={containerID} ></Container>
        );
    }

    // ESRI JSAPI
    startup = (mapConfig, node, features) => {
        createView(mapConfig, node).then(
            response => {
                this.init(response);
                this.setupWidgetsAndLayers(features);
                console.log('adding features: ', features);
                this.setupEventHandlers(this.map);
                this.finishedLoading();
            },
            error => {
                console.error("maperr", error);
                window.setTimeout(()=>{
                    this.startup(mapConfig, node, features);
                }, 1000);
            }
        )
    }

    finishedLoading = () => {
      // Update app state only after map and widgets are loaded
      this.props.onMapLoaded();
    }

    init = response => {
      console.log('Init Map View: ', response);
        this.view = response.view
        this.map = response.view.map;
    }

    setupWidgetsAndLayers = features => {
        loadModules([
            'dojo/on',
            'esri/layers/FeatureLayer'
        ]).then( ([
            on,
            FeatureLayer,
        ]) => {
            if (features && features.length > 0) {
                let fl = null;
                features.forEach( (featureLayer) => {
                    console.log('trying to add layer: ', featureLayer);
                    fl = new FeatureLayer({
                        url: featureLayer
                    });
                    this.map.add(fl);
                });

                console.log('Map for Layer: ', this.map);

                fl.queryExtent()
              .then( (response) => {
                this.view.goTo(response.extent);
              });
            }
        });
    }

    setupEventHandlers = map => {
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

export default connect(mapStateToProps, mapDispatchToProps) (MapView);
