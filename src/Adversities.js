import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  FormControl,
  Form,
  FormGroup,
  InputGroup
} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import Spinner from "react-spinner";
import firebase from "firebase";

import userRefFor from "./userRef";

const Presentation = props =>
  props.loaded
    ? // If we've just created a new adversity
      props.newAdversityId
        ? // Redirect to it
          <Redirect to={`/adversities/${props.newAdversityId}`} />
        : // Otherwise just display the regular form
          <div>
            <Form onSubmit={props.handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Adversity"
                    value={props.description}
                    onChange={props.handleChange}
                  />
                  <InputGroup.Button>
                    <Button type="submit" disabled={props.isSaving}>
                      Go
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </Form>
            <div className="list-group">
              {props.adversities.map(adversity => {
                const id = adversity[".key"];

                return (
                  <Link
                    key={id}
                    className="adversity list-group-item"
                    to={`/adversities/${id}`}
                  >
                    {adversity.description}
                    <span
                      onClick={e => {
                        e.preventDefault();
                        props.remove(id);
                      }}
                      className="remove glyphicon glyphicon-remove"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
    : <Spinner />;

export default React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    user: React.PropTypes.instanceOf(firebase.User).isRequired
  },
  getInitialState() {
    return {
      description: ""
    };
  },
  componentWillMount() {
    this.bindAsArray(
      userRefFor(this.props.user).child("adversities"),
      "adversities"
    );
    // Once the data has loaded for the first time, stop displaying the spinner
    this.firebaseRefs.adversities
      .once("value")
      .then(() => this.setState({ loaded: true }));
  },
  render() {
    const { state } = this;

    return (
      <Presentation
        loaded={state.loaded}
        adversities={state.adversities}
        newAdversityId={state.newAdversityId}
        handleSubmit={this.handleSubmit}
        description={state.description}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        remove={this.remove}
      />
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({ description: e.target.value });
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSaving: true });
    this.firebaseRefs.adversities
      .push({
        description: this.state.description
      })
      .then(adversity => {
        this.setState({ newAdversityId: adversity.key });
      });
  },
  /**
   * Remove an adversity and all of its associated beliefs
   */
  remove(adversityId) {
    // TODO See if there's a way to do this in a transaction
    this.firebaseRefs.adversities
      .child(adversityId)
      .remove()
      .then(() => {
        // Delete the beliefs for the adversity
        // TODO See if there's a way to do this in one hit rather than iteratively
        return userRefFor(this.props.user)
          .child("beliefs")
          .orderByChild("adversityId")
          .equalTo(adversityId)
          .once("value")
          .then(snapshot => {
            let promises = [];

            snapshot.forEach(childSnapshot => {
              promises = promises.concat(childSnapshot.ref.remove());
            });

            return Promise.all(promises);
          });
      })
      .catch(error => console.error(error));
  }
});
