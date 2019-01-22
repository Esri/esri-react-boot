// NOTE
// This is a "special" react component that does not strictly play by
// React's rules.
//
// Conceptually, this component creates a "portal" in React by
// closing its render method off from updates (by simply rendering a div and
// never accepting re-renders) then reconnecting itself to the React lifecycle
// by listening for any new props (using componentWillReceiveProps)

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as mapActions } from '../../redux/reducers/map';

import styled from 'styled-components';

const containerID = "map-view-container";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

class MapView extends Component {

    componentDidMount() {
        console.log(this.props.mapConfig);
        this.props.startMapView(
            this.props.mapConfig,
            containerID,
            this.props.features
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Tell React to never update this component, that's up to us
        return false;
    }

    render() {
        return (
            <Container ref="mapDiv" id="map-view-container" ></Container>
        );
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
