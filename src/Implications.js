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
import List from "./List";
import disputationPropTypes from "./disputationPropTypes";
import PagerLink from "./PagerLink";

const Presentation = ({ belief, beliefs, ...props }) => {
  const beliefId = belief.id;
  const index = beliefs.findIndex(b => b.id === beliefId);
  if (index < 0) throw new Error(`Belief with ID ${beliefId} not found`);

  let nextText = "Finish";
  let nextPath = `/adversities/${belief.adversity.id}`;

  if (index < beliefs.length - 1) {
    nextText = "Next Belief";
    nextPath = `/beliefs/${beliefs[index + 1].id}/evidence`;
  }

  return (
    <div>
      <Form onSubmit={props.handleSubmit}>
        <ControlLabel>
          What are the implications if&nbsp;
          {lowerCaseFirstLetter(belief.description)}?
        </ControlLabel>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Implication"
              value={props.description}
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
      <List value={props.implications} remove={props.remove} />
      <Pager>
        <PagerLink
          to={`/beliefs/${beliefId}/alternatives`}
          previous
          text="Alternatives"
        />
        <PagerLink to={nextPath} text={nextText} />
      </Pager>
    </div>
  );
};

const Container = React.createClass({
  propTypes: disputationPropTypes,
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      description: ""
    };
  },
  render() {
    const { props, state } = this;
    return (
      <Presentation
        belief={props.belief}
        beliefs={props.beliefs}
        handleSubmit={this.handleSubmit}
        description={state.description}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        implications={props.implicationsQuery.allImplications}
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

    this.props.createImplicationMutation({
      variables: {
        description: this.state.description,
        beliefId: this.props.belief.id
      }
    }).then(() => {
      this.setState({ description: "", isSaving: false });
    });
  },
  remove(id) {
    this.props.deleteImplicationMutation({
      variables: { id }
    })
  }
});

// TODO Investigate how to merge into query done by Belief.js
const IMPLICATIONS_QUERY = gql`
  query ImplicationsQuery($beliefId: ID!) {
    allImplications(filter: {belief: {id: $beliefId}}) {
      id
      description
    }
  }
`

const CREATE_IMPLICATION_MUTATION = gql`
  mutation CreateImplicationMutation($beliefId: ID!, $description: String!) {
    createImplication(beliefId: $beliefId, description: $description) {
      id
    }
  }
`

const DELETE_IMPLICATION_MUTATION = gql`
  mutation DeleteImplicationMutation($id: ID!) {
    deleteImplication(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(IMPLICATIONS_QUERY, {
    name: 'implicationsQuery',
    options: props => ({ variables: { beliefId: props.belief.id } })
  }),
  graphql(CREATE_IMPLICATION_MUTATION, {
    name: 'createImplicationMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'ImplicationsQuery'
      ],
    }
  }),
  graphql(DELETE_IMPLICATION_MUTATION, {
    name: 'deleteImplicationMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'ImplicationsQuery'
      ],
    }
  })
)(Container)