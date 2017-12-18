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
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Remove from "./Remove";
import userRefFor from "./userRef";

export const Presentation = props =>
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
              <ReactCSSTransitionGroup
                transitionName="list-group-item"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {props.adversities.map(adversity => {
                  const { id } = adversity;

                  return (
                    <Link
                      key={id}
                      className="adversity list-group-item"
                      to={`/adversities/${id}`}
                    >
                      {adversity.description}
                      <Remove remove={() => props.remove(id)} />
                    </Link>
                  );
                })}
              </ReactCSSTransitionGroup>
            </div>
          </div>
    : <Spinner />;

const Container = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    user: React.PropTypes.instanceOf(firebase.User).isRequired
  },
  getInitialState() {
    return {
      description: ""
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.allAdversitiesQuery.refetch()
    }
  },

  render() {
    const { state } = this;

    return (
      <Presentation
        loaded={!this.props.allAdversitiesQuery.loading}
        adversities={this.props.allAdversitiesQuery.allAdversities}
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
    this.props.createAdversityMutation({variables: { description: this.state.description}}).then(({data}) => {
      this.setState({ newAdversityId: data.createAdversity.id });
    })
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

const ALL_ADVERSITIES_QUERY = gql`
  query AllAdversitiesQuery {
    allAdversities(orderBy: createdAt_DESC) {
      id
      description
    }
  }
`
const CREATE_ADVERSITY_MUTATION = gql`
  mutation CreateAdversityMutation($description: String!) {
    createAdversity(description: $description) {
      id
      description
    }
  }
`

export default compose(
  graphql(ALL_ADVERSITIES_QUERY, {
    name: 'allAdversitiesQuery',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(CREATE_ADVERSITY_MUTATION, {
    name: 'createAdversityMutation'
  })
)(Container)