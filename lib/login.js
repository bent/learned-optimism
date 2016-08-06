import React from 'react';
import { Button, FormControl, Form, FormGroup, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router';

import firebase from './firebase';

module.exports = withRouter(React.createClass({
  getInitialState() {
    return {
      email: '',
      password: ''
    };
  },
  render() {
    const errorMessage = this.state.errorMessage;

    return (
      <Form onSubmit={this.handleSubmit}>
        {errorMessage && <Alert bsStyle="danger">{errorMessage}</Alert>}
        <FormGroup>
          <FormControl type='text' 
                 placeholder='Email' 
                 value={this.state.email}
                 onChange={this.handleEmailChange}/>
        </FormGroup>
        <FormGroup>
          <FormControl type='password' 
                 placeholder='Password' 
                 value={this.state.password}
                 onChange={this.handlePasswordChange}/>
        </FormGroup>
        <Button 
          type="submit"
          disabled={this.state.isLoggingIn}
        >
          {this.state.isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    );
  },  
  handleEmailChange(e) {
    this.setState({email: e.target.value});
  },
  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  },
  handleSubmit() {
    this.setState({isLoggingIn: true});
    
    firebase.auth().signInWithEmailAndPassword(
      this.state.email, this.state.password
    ).then(user => {
      this.setState({isLoggingIn: false});
      this.props.router.push('/');
      this.props.setUser(user);
    }).catch(error => {
      this.setState({errorMessage: error.message, isLoggingIn: false});
    });
  }
}));