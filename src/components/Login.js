// Imports //
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions } from '../redux/reducers/auth';

import styled from 'styled-components';

import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';

import background from '../styles/images/TopoDesignOne.jpg';

// Styled Components //
const Container = styled.div`
    height: 100%;
    width: 100%;
    background: url(${background}) no-repeat center/cover;
`;

const Content = styled.div`
    padding: 15px;
`;

const BtnRow = styled.div`
    padding: 15px;
    text-align: center;
`;

// Class //
class Login extends Component {
    // Methods //
    componentDidMount() {
        if (this.props.apiIsLoaded) {
            console.log('attempting login...');
            this.props.login();
        }
    }

    handleLogin = () => {
        console.log('attempting login...again');
        this.props.login();
    }

    render() {
        return (
          <Container>
              <Dialog header="Login Required" visible={true} width="350px" modal={true} closable={false} onHide={(e) => this.setState({visible: false})}>
                  <Content>Please login to Esri organization to use application.</Content>
                  <BtnRow>
                      <Button label="LOGIN" onClick={this.handleLogin}></Button>
                  </BtnRow>
              </Dialog>
          </Container>
        );
    }
}

// Redux Mapping //
const mapStateToProps = state => ({
  appConfig: state.config,
  auth: state.auth,
})

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...authActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
