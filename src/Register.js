import React from 'react';

import { Button, FormControl, Form, FormGroup, Alert } from 'react-bootstrap';

import firebase from './firebase';

module.exports = React.createClass({
  getInitialState() {
    return {
      email: '',
      password: ''
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
        <Button type="submit">Register</Button>
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
    firebase.auth().createUserWithEmailAndPassword(
      this.state.email, this.state.password
    ).then(() => {
      this.props.router.push('/');
    }).catch(error => {
      this.setState({errorMessage: error.message});
    });
  }
});