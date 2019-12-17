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

/**
 * This is an example component used to showcase authentication
 * @type {Class}
 */

// React
import React from "react";

// Components
import TopNavActionsList from "calcite-react/TopNav/TopNavActionsList";
import ArcgisAccount from "calcite-react/ArcgisAccount";
import ArcgisAccountMenuItem from "calcite-react/ArcgisAccount/ArcgisAccountMenuItem";
import Button from "calcite-react/Button";

// Class
const UserAccount = props => {
  const signedInActionsComponent = props.user ? (
    <TopNavActionsList style={{ padding: 0 }}>
      <ArcgisAccount
        user={props.user}
        portal={props.portal}
        token={props.token}
        onRequestSwitchAccount={() => console.log("switch account clicked")}
        onRequestSignOut={props.signOut}
      >
        <ArcgisAccountMenuItem
          onClick={() => console.log("Profile & Settings clicked")}
        >
          Profile & Settings
        </ArcgisAccountMenuItem>
        <ArcgisAccountMenuItem onClick={() => console.log("My Esri clicked")}>
          My Esri
        </ArcgisAccountMenuItem>
        <ArcgisAccountMenuItem onClick={() => console.log("Training clicked")}>
          Training
        </ArcgisAccountMenuItem>
        <ArcgisAccountMenuItem
          onClick={() => console.log("Community & Forums clicked")}
        >
          Community & Forums
        </ArcgisAccountMenuItem>
        <ArcgisAccountMenuItem
          onClick={() => console.log("ArcGIS Online clicked")}
        >
          ArcGIS Online
        </ArcgisAccountMenuItem>
      </ArcgisAccount>
    </TopNavActionsList>
  ) : null;

  const signedOutActionsComponent = (
    <TopNavActionsList>
      <Button clear onClick={props.signIn}>
        Sign In
      </Button>
    </TopNavActionsList>
  );

  let outputComponent = props.loggedIn
    ? signedInActionsComponent
    : signedOutActionsComponent;

  return <div>{outputComponent}</div>;
};

export default UserAccount;
