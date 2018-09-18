import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ButtonToolbar,
  FormControl,
  Form,
  FormGroup,
  Alert
} from "react-bootstrap";

// import firebase from "./firebase";

const Presentation = ({ errorMessage, isLoggingIn, ...props }) => (
  <Form onSubmit={props.handleSubmit}>
    {errorMessage && <Alert bsStyle="danger">{errorMessage}</Alert>}
    <FormGroup>
      <FormControl
        type="text"
        placeholder="Email"
        value={props.email}
        onChange={props.handleEmailChange}
      />
    </FormGroup>
    <FormGroup>
      <FormControl
        type="password"
        placeholder="Password"
        value={props.password}
        onChange={props.handlePasswordChange}
      />
    </FormGroup>
    <ButtonToolbar>
      <Button type="submit" bsStyle="primary" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>
      <Link className="btn btn-link" to="/register">Register</Link>
    </ButtonToolbar>
  </Form>
);

export default React.createClass({
  getInitialState() {
    return {
      email: "",
      password: ""
    };
  },
  render() {
    const { state } = this;

    return (
      <Presentation
        errorMessage={state.errorMessage}
        isLoggingIn={state.isLoggingIn}
        handleSubmit={this.handleSubmit}
        email={state.email}
        handleEmailChange={this.handleEmailChange}
        password={state.password}
        handlePasswordChange={this.handlePasswordChange}
      />
    );
  },
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  },
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isLoggingIn: true });

    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(this.state.email, this.state.password)
    //   .catch(error => {
    //     this.setState({ errorMessage: error.message, isLoggingIn: false });
    //   });
  }
});
