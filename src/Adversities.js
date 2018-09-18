import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  FormControl,
  Form,
  FormGroup,
  InputGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "react-spinner";
// import firebase from "firebase";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Remove from "./Remove";

export const Presentation = props =>
  props.loaded ?
    <div>
      <Form onSubmit={props.handleSubmit}>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Todo"
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
                to={`/todos/${id}`}
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
    // user: React.PropTypes.instanceOf(firebase.User).isRequired
  },
  getInitialState() {
    return {
      description: ""
    };
  },

  render() {
    const { state } = this;

    return (
      <Presentation
        loaded={!this.props.allAdversitiesQuery.loading}
        adversities={this.props.allAdversitiesQuery.getAllTodos}
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
      this.setState({ description: "" });
    })
  },
  /**
   * Remove an adversity and all of its associated beliefs
   */
  remove(adversityId) {
    this.props.deleteAdversityMutation({
      variables: { id: adversityId }
    }).catch(error => console.error(error));
  }
});

const ALL_ADVERSITIES_QUERY = gql`
  query AllAdversitiesQuery {
    getAllTodos {
      id
      description
    }
  }
`
const CREATE_ADVERSITY_MUTATION = gql`
  mutation CreateAdversityMutation($description: String!) {
    createTodo(description: $description) {
      id
      description
    }
  }
`

const DELETE_ADVERSITY_MUTATION = gql`
  mutation DeleteAdversityMutation($id: ID!) {
    deleteTodo(id: $id) {
      id
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
    name: 'createAdversityMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'AllAdversitiesQuery'
      ],
    }
  }),
  graphql(DELETE_ADVERSITY_MUTATION, {
    name: 'deleteAdversityMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'AllAdversitiesQuery'
      ],
    }
  })
)(Container)