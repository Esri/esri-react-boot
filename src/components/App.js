import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import { Route } from 'react-router';

import { actions as authActions } from '../redux/reducers/auth';
import { actions as configActions } from '../redux/reducers/config';

import Loading from './Loading';
//import Login from './Login';
import Main from './Main';
//import AuthManager from './esri/auth/AuthManager';

class App extends Component {

    componentDidMount() {
        this.props.fetchConfig();
    }

  render() {
    // We'll use these to determine what state the app is in
    const configLoaded = this.props.appConfig.loaded;
    const authTried = this.props.auth.loaded;
    const isAuthenticated = this.props.auth.user && this.props.auth.user.username;

    // Three possible states:
    //  1. App is initializing --> show splash component
    //  2. User is not logged in --> show login component
    //  3. User is logged in --> show Main component

    //
    // 1. App is initializing
    //
    if (!authTried || !isAuthenticated || !configLoaded) {
      return (
          <Loading isLoaded={false}/>
      )
    }
    //TODO remove this state... depricated
    // 2. User is not logged in
    //
    // else if (false) {
    //   return (
    //     <div style={{height: '100%'}}>
    //       <Route path="/" component={Login} />
    //     </div>
    //   )
    // }
    //
    // 3. User is logged in
    //
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
