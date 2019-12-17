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
import { useSelector, useDispatch } from "react-redux";
import { fetchConfig } from "../redux/reducers/config";
import { checkAuth, startAuth, completeAuth } from "../redux/reducers/auth";

// Component imports
import LoadScreen from "./LoadScreen";
import Main from "./Main";

// Component definition
const App = props => {
  // we'll use the url to determin sign-in state
  const { pathname } = props.location;
  // redux store state
  const user = useSelector(state => state.auth.user);
  const config = useSelector(state => state.config);
  const dispatch = useDispatch();

  // when the component mounts request the config and load it into the Redux state
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  // once the component mounts and the config loads, check if we have a saved session
  useEffect(() => {
    // if the config isn't yet loaded then skip this effect
    if (!config.loaded) {
      return;
    }

    const { portalUrl, clientId, sessionId } = config;

    dispatch(checkAuth({ portalUrl, clientId, sessionId }));
  }, [config, dispatch]);

  // if there's no stored session, we'll watch the url path to see if we need to kick off an authentication
  // this can happen automatically with a portalUrl property in the config
  // or if the user requests a login through an event
  useEffect(() => {
    // if the config isn't yet loaded then skip this effect
    if (!config.loaded) {
      return;
    }

    const { portalUrl, clientId, sessionId } = config;

    // we'll start the authentication here and it will return here to complete
    if (portalUrl && !user && pathname !== "/auth") {
      dispatch(startAuth({ portalUrl, clientId, sessionId }));
    } else if (pathname === "/auth" && !user) {
      dispatch(completeAuth({ portalUrl, clientId, sessionId }));
    }
  }, [config, user, pathname, dispatch]);

  // set a halt state to allow the authentication process to complete before
  // we redirect to the main component
  let signInRequested = false;
  if (pathname === "/auth") {
    signInRequested = true;
  }

  // RENDER RETURN
  // app is initializing for the following reasons, show the load screen
  // 1. config is not yet loaded
  // 2. authentication is required but there is no user information
  // 3. authentication is not required but user has requested to sign-in
  if (
    !config.loaded ||
    (config.portalUrl && !user) ||
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

export default App;
