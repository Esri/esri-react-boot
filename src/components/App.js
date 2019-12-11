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
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

// Redux imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as authActions } from "../redux/reducers/auth";
import { actions as configActions } from "../redux/reducers/config";

// Component imports
import LoadScreen from "./LoadScreen";
import Main from "./Main";

// Component definition
const App = props => {
  // check location and grab user info if available
  const { pathname } = props.location;
  const { user } = props.auth;
  const { config, fetchConfig, checkAuth, startAuth, completeAuth } = props;
  // variables to determine state of component
  const isConfigLoaded = config.loaded;
  const isAuthRequired = props.auth.portalUrl ? true : false;
  let signInRequested = false;
  // set a halt state to allow the authentication process to complete before
  // we redirect to the main component
  if (pathname === "/auth" && !user) {
    signInRequested = true;
  }

  // When the component mounts request the config and load it into the Redux state
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // on update check for authentication
  useEffect(() => {
    // if the config isn't yet loaded then skip this effect
    if (!isConfigLoaded) {
      return;
    }

    const { portalUrl, clientId, sessionId } = config;

    // Check if the app needs to start the auth process or complete the process
    if (portalUrl && !user && pathname !== "/auth") {
      startAuth({ portalUrl, clientId, sessionId });
    } else if (pathname === "/auth" && !user) {
      completeAuth({ portalUrl, clientId, sessionId });
    } else {
      checkAuth({ portalUrl, clientId, sessionId });
    }
  }, [
    isConfigLoaded,
    config,
    pathname,
    user,
    checkAuth,
    startAuth,
    completeAuth
  ]);

  // App is initializing for the following reasons, show the load screen
  // 1. config is not yet loaded
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
};

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
