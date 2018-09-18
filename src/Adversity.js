import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  FormControl,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel
} from "react-bootstrap";
import Spinner from "react-spinner";
// import firebase from "firebase";
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import AdversityPanel from "./AdversityPanel";
import List from "./List";

const Presentation = ({ beliefs, ...props }) =>
  props.loaded
    ? <AdversityPanel value={props.adversity}>
        <Form onSubmit={props.handleSubmit}>
          <ControlLabel>
            Subtasks
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Enter subtask here"
                value={props.beliefDescription}
                onChange={props.handleChange}
              />
              <InputGroup.Button>
                <Button type="submit" disabled={props.isSaving}>
                  Add
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        <List value={beliefs} remove={props.remove}/>
      </AdversityPanel>
    : <Spinner />;

const Container = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    // user: React.PropTypes.instanceOf(firebase.User).isRequired,
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        adversityId: React.PropTypes.string.isRequired
      }).isRequired
    })
  },
  getInitialState() {
    return {
      beliefDescription: ""
    };
  },
  componentWillReceiveProps(nextProps) {
    const { adversityId } = nextProps.match.params

    if (this.props.match.params.adversityId !== adversityId) {
      this.props.adversityQuery.refetch({ id: adversityId })
    }
  },
  render() {
    const { state } = this;
    const { getTodo } = this.props.adversityQuery

    return (
      <Presentation
        loaded={!this.props.adversityQuery.loading}
        adversity={getTodo}
        handleSubmit={this.handleSubmit}
        beliefDescription={state.beliefDescription}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        beliefs={getTodo && getTodo.subtasks}
        remove={this.remove}
      />
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({ beliefDescription: e.target.value });
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSaving: true });
    this.props.createBeliefMutation({
      variables: { 
        description: this.state.beliefDescription,
        todoId: this.props.match.params.adversityId
      }
    }).then(() => {
      this.setState({
        beliefDescription: "",
        isSaving: false
      });
    });
  },
  remove(beliefId) {
    this.props.deleteBeliefMutation({
      variables: { id: beliefId }
    })
  }
});

const ADVERSITY_QUERY = gql`
  query AdversityQuery($id: ID!) {
    getTodo(id: $id) {
      description
      subtasks {
        id
        description
      }
    }
  }
`

const CREATE_BELIEF_MUTATION = gql`
  mutation CreateBeliefMutation($todoId: ID!, $description: String!) {
    createSubtask(todoId: $todoId, description: $description) {
      id
    }
  }
`

const DELETE_BELIEF_MUTATION = gql`
  mutation DeleteBeliefMutation($id: ID!) {
    deleteSubtask(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(ADVERSITY_QUERY, { 
    name: 'adversityQuery',
    options: props => ({ variables: { id: props.match.params.adversityId } })
  }),
  graphql(CREATE_BELIEF_MUTATION, { 
    name: 'createBeliefMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'AdversityQuery'
      ],
    }
  }),
  graphql(DELETE_BELIEF_MUTATION, {
    name: 'deleteBeliefMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'AdversityQuery'
      ],
    }
  })
)(Container)
