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

import styled, { injectGlobal } from 'styled-components';

const containerID = "web-scene-view-container";

injectGlobal`
    .map, #${containerID} {
        height: 100%;
        width: 100%;
    }
`;

class SceneView extends Component {

    componentDidMount() {
        this.props.startSceneView(
            this.props.mapConfig,
            this.props.user,
            containerID
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Tell React to never update this component, that's up to us
        return false;
    }

    render() {
        return (
            <div ref="mapDiv" id={containerID}></div>
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

export default connect(mapStateToProps, mapDispatchToProps) (SceneView);
