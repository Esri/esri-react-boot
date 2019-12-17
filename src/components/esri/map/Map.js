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

// React imports
import React from "react";

// ESRI ArcGIS API
import { loadMap } from "../../../utils/map";

// Styled Components
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

// Component
const Map = props => {
  // set an ID for the map to attach to
  const containerID = "map-view-container";

  // load map with config properties
  loadMap(containerID, props.mapConfig).then(() => {
    // call the map loaded event when we get the map view back
    props.onMapLoaded();
  });

  // Compnent template
  return <Container id={containerID}></Container>;
};

export default Map;
