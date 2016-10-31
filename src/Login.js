import React from 'react';
import { Button, ButtonToolbar, FormControl, Form, FormGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

import firebase from './firebase';

export default React.createClass({
  getInitialState() {
    return {
      email: '',
      password: ''
    };
  },
  render() {
    const {errorMessage, isLoggingIn} = this.state;

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
        <ButtonToolbar>
          <Button type="submit" bsStyle="primary" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
          <Link to={'/register'}>{({onClick}) =>
            <Button bsStyle="link" onClick={onClick}>Register</Button>
          }</Link>
        </ButtonToolbar>
      </Form>
    );
  },  
  handleEmailChange(e) {
    this.setState({email: e.target.value});
  },
  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isLoggingIn: true});

    firebase.auth().signInWithEmailAndPassword(
      this.state.email, this.state.password
    ).catch(error => {
      this.setState({errorMessage: error.message, isLoggingIn: false});
    });
  }
});