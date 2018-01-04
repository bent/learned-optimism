import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  FormControl,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel,
  Pager
} from "react-bootstrap";

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import lowerCaseFirstLetter from "./lowerCaseFirstLetter";
import disputationPropTypes from "./disputationPropTypes";
import List from "./List";
import PagerLink from "./PagerLink";

const Presentation = ({ belief, ...props }) => {
  const beliefId = belief.id;

  return (
    <div>
      <Form onSubmit={props.handleSubmit}>
        <ControlLabel>
          What alternatives are there to&nbsp;
          {lowerCaseFirstLetter(belief.description)}?
        </ControlLabel>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Alternative"
              value={props.alternativeDescription}
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
      <List value={props.alternatives} remove={props.remove} />
      <Pager>
        <PagerLink
          to={`/beliefs/${beliefId}/evidence`}
          previous
          text="Evidence"
        />
        <PagerLink
          to={`/beliefs/${beliefId}/implications`}
          text="Implications"
        />
      </Pager>
    </div>
  );
};

const Container = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: disputationPropTypes,
  getInitialState() {
    return {
      alternativeDescription: ""
    };
  },
  render() {
    const { state } = this;

    return (
      <Presentation
        belief={this.props.belief}
        handleSubmit={this.handleSubmit}
        alternativeDescription={state.alternativeDescription}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        alternatives={this.props.alternativesQuery.alternativesForBelief}
        remove={this.remove}
      />
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({ alternativeDescription: e.target.value });
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSaving: true });

    this.props.createAlternativeMutation({
      variables: {
        description: this.state.alternativeDescription,
        beliefId: this.props.belief.id
      }
    }).then(() => {
      this.setState({ alternativeDescription: "", isSaving: false });
    });
  },
  remove(id) {
    this.props.deleteAlternativeMutation({
      variables: { id }
    })
  }
});

// TODO Investigate how to merge into query done by Belief.js
const ALTERNATIVES_QUERY = gql`
  query AlternativeQuery($beliefId: ID!) {
    alternativesForBelief(beliefId: $beliefId) {
      id
      description
    }
  }
`

const CREATE_ALTERNATIVE_MUTATION = gql`
  mutation CreateAlternativeMutation($beliefId: ID!, $description: String!) {
    createAlternative(beliefId: $beliefId, description: $description) {
      id
    }
  }
`

const DELETE_ALTERNATIVE_MUTATION = gql`
  mutation DeleteAlternativeMutation($id: ID!) {
    deleteAlternative(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(ALTERNATIVES_QUERY, {
    name: 'alternativesQuery',
    options: props => ({ variables: { beliefId: props.belief.id } })
  }),
  graphql(CREATE_ALTERNATIVE_MUTATION, {
    name: 'createAlternativeMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'AlternativeQuery'
      ],
    }
  }),
  graphql(DELETE_ALTERNATIVE_MUTATION, {
    name: 'deleteAlternativeMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'AlternativeQuery'
      ],
    }
  })
)(Container)