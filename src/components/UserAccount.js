/**
 * This is an example component used to showcase authentication
 * @type {Class}
 */

// React
import React, { Component } from 'react';

// Components
import TopNavActionsList from 'calcite-react/TopNav/TopNavActionsList';
import ArcgisAccount from 'calcite-react/ArcgisAccount';
import ArcgisAccountMenuItem from 'calcite-react/ArcgisAccount/ArcgisAccountMenuItem';
import Button from 'calcite-react/Button';

// Class
class UserAccount extends Component {
  render() {
    const signedInActionsComponent = this.props.user ? (
      <TopNavActionsList style={{ padding: 0 }}>
        <ArcgisAccount
          user={this.props.user}
          portal={this.props.portal}
          onRequestSwitchAccount={() => console.log('switch account clicked')}
          onRequestSignOut={this.props.signOut}
        >
          <ArcgisAccountMenuItem
            onClick={() => console.log('Profile & Settings clicked')}
          >
            Profile & Settings
          </ArcgisAccountMenuItem>
          <ArcgisAccountMenuItem onClick={() => console.log('My Esri clicked')}>
            My Esri
          </ArcgisAccountMenuItem>
          <ArcgisAccountMenuItem onClick={() => console.log('Training clicked')}>
            Training
          </ArcgisAccountMenuItem>
          <ArcgisAccountMenuItem
            onClick={() => console.log('Community & Forums clicked')}
          >
            Community & Forums
          </ArcgisAccountMenuItem>
          <ArcgisAccountMenuItem
            onClick={() => console.log('ArcGIS Online clicked')}
          >
            ArcGIS Online
          </ArcgisAccountMenuItem>
        </ArcgisAccount>
      </TopNavActionsList>
    ) : null;

    const signedOutActionsComponent = (
      <TopNavActionsList>
        <Button
          clear
          onClick={this.props.signIn}
        >
          Sign In
        </Button>
      </TopNavActionsList>
    );

    let outputComponent = this.props.loggedIn ?
      signedInActionsComponent :
      signedOutActionsComponent;

    return (
      <div>{outputComponent}</div>
    )
  }
}

export default UserAccount;
