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

// React imports
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

// Redux imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as authActions } from "../redux/reducers/auth";
import { actions as configActions } from "../redux/reducers/config";

// Component imports
import LoadScreen from "./LoadScreen";
import Main from "./Main";

// Component
class App extends Component {
  constructor(props) {
    super(props);

    const { pathname } = this.props.location;
    const { user } = this.props.auth;
    let signInRequested = false;

    // set a halt state to allow the authentication process to complete before
    // we redirect to the main component
    if (pathname === "/auth" && !user) {
      signInRequested = true;
    }

    this.state = {
      signInRequested
    };
  }

  componentDidMount() {
    // When the component mounts request the config and load it into the Redux state
    this.props.fetchConfig();
  }

  componentDidUpdate(prevProps) {
    // Check that the config was initially loaded and don't run this process again
    if (this.props.config && this.props.config !== prevProps.config) {
      const { portalUrl, appId, sessionId, loginWithPopup } = this.props.config;
      console.log(this.props.location);
      if (
        this.props.config.portalUrl &&
        !this.props.auth.user &&
        this.props.location.pathname !== "/auth"
      ) {
        this.props.checkAuth({
          portalUrl,
          clientId: appId,
          sessionId,
          popup: loginWithPopup
        });
      } else if (
        this.props.location.pathname === "/auth" &&
        !this.props.auth.user
      ) {
        console.log("COMPLETING THE AUTH!");
        this.props.completeAuth({
          portalUrl,
          clientId: appId,
          sessionId,
          popup: loginWithPopup
        });
      }
    }
  }

  render() {
    // properties used to determine the user access to the app
    const { user } = this.props.auth;
    const isConfigLoaded = this.props.config.loaded;
    const isAuthRequired = this.props.auth.portalUrl ? true : false;

    const { signInRequested } = this.state;

    // App is initializing for the following reasons, show the load screen
    // 1. config is not is not loaded
    // 2. authentication is required but there is no user information
    // 3. authentication is not required but user has requested to sign-in
    if (
      !isConfigLoaded ||
      (isAuthRequired && !user) ||
      (signInRequested && !user)
    ) {
      return <LoadScreen isLoaded={false} />;
    }

    // App is initialized and user is authenticated if needed, route to main component
    return (
      <>
        <Route path="/main" component={Main} />
        <Redirect to="/main" />
      </>
    );
  }
}

// Map Redux state to Component props
const mapStateToProps = state => ({
  auth: state.auth,
  config: state.config
});

// Map Redux Actions to Component props
const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      ...configActions,
      ...authActions
    },
    dispatch
  );
};

// Component export
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
