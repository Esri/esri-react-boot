// React
import React, { Component } from 'react';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions } from '../redux/reducers/auth';
import { actions as configActions } from '../redux/reducers/config';

// Components
import AuthManager from './esri/auth/AuthManager';
import LoadScreen from './LoadScreen';
import Main from './Main';

class App extends Component {

  componentDidMount() {
    // When the component mounts call to get the config file
    this.props.fetchConfig();
  }

  componentDidUpdate(prevProps) {
    // Check that the config was initially loaded and don't run this process again
    if (this.props.appConfig &&
      this.props.appConfig.loaded !== prevProps.appConfig.loaded)
    {
      // Attach the AuthManager to the window, it doesn't need to be rendered
      window.authManager = new AuthManager(
        this.props.appConfig.appId,
        this.props.appConfig.portalUrl,
        this.props.appConfig.jsapiUrl,
        this.props.appConfig.jsapiV4,
        this.props.appConfig.loginWithPopup
      );
      window.authManager.startup().then(this.props.checkAuth);
    }
  }

  render() {
    // We'll use these to determine what state the app is in
    const configLoaded = this.props.appConfig.loaded;
    const authTried = this.props.auth.loaded;
    // We don't need to authenticate if there is no portalUrl
    const isAuthenticated = (this.props.auth.user && this.props.auth.user.username) || !this.props.appConfig.portalUrl;

    // App is initializing
    if (!authTried || !isAuthenticated || !configLoaded) {
      return (
          <LoadScreen isLoaded={false}/>
      )
    }

    // App is initialized and user is authenticated if needed
    return <Main />

  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  appConfig: state.config
})

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...configActions,
    ...authActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
