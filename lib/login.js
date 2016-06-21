import React from 'react';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';

import firebase from './firebase';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      password: ''
    };
  },
  render: function() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormControl type='text' 
               placeholder='Email' 
               value={this.state.email}
               onChange={this.handleEmailChange}/>
        <FormControl type='password' 
               placeholder='Password' 
               value={this.state.password}
               onChange={this.handlePasswordChange}/>
        <Button type="submit">Login</Button>
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
    firebase.auth.signInWithEmailAndPassword(
      this.state.email, this.state.password
    ).then(function() {
      console.log('logged in!');
    }).catch(function() {
      console.error('failed!');
    });
  }
});