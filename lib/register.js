import React from 'react';
import { Button, FormControl, Form, FormGroup, Alert } from 'react-bootstrap';

import firebase from './firebase';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      password: ''
    };
  },
  render: function() {
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
        <Button type="submit">Register</Button>
      </Form>
    );
  },
  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },
  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },
  handleSubmit: function() {
    firebase.auth().createUserWithEmailAndPassword(
      this.state.email, this.state.password
    ).then(function() {
      console.log('registered!');
    }).catch(error => this.setState({errorMessage: error.message}));
  }
});