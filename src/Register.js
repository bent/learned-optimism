import React from 'react';
import { Button, FormControl, Form, FormGroup, Alert } from 'react-bootstrap';

import firebase from './firebase';

export default React.createClass({
  getInitialState() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  render() {
    const {errorMessage} = this.state;

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
        <FormGroup>
          <FormControl type='password' 
                 placeholder='Confirm Password' 
                 value={this.state.confirmPassword}
                 onChange={this.handleConfirmPasswordChange}/>
        </FormGroup>
        <Button bsStyle="primary" type="submit">Register</Button>
      </Form>
    );
  },
  handleEmailChange(e) {
    this.setState({email: e.target.value});
  },
  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  },
  handleConfirmPasswordChange(e) {
    this.setState({confirmPassword: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.password === this.state.confirmPassword) {
      firebase.auth().createUserWithEmailAndPassword(
        this.state.email, this.state.password
      ).catch(error => {
        this.setState({errorMessage: error.message});
      });      
    } else {
      this.setState({errorMessage: 'Passwords do not match'});
    }
  }
});