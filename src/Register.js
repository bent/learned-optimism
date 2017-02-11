import React from 'react';
import { ButtonToolbar, Button, FormControl, Form, FormGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    const {errorMessage, isRegistering} = this.state;

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
        <ButtonToolbar>
          <Button bsStyle="primary" type="submit" disabled={isRegistering}>
            {isRegistering ? 'Registering...' : 'Register'}
          </Button>
          <Link to="/login">{({onClick}) => (
            <Button onClick={onClick}>
              Cancel
            </Button>
          )}</Link>
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
  handleConfirmPasswordChange(e) {
    this.setState({confirmPassword: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();

    if (this.state.password === this.state.confirmPassword) {
      this.setState({isRegistering: true});

      firebase.auth().createUserWithEmailAndPassword(
        this.state.email, this.state.password
      ).catch(error => {
        this.setState({errorMessage: error.message, isRegistering: false});
      });      
    } else {
      this.setState({errorMessage: 'Passwords do not match'});
    }
  }
});