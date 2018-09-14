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

  let previousText = "Beliefs";
  let previousPath = `/adversities/${belief.adversity.id}`;

  if (index > 0) {
    previousText = "Prev. Belief";
    previousPath = `/beliefs/${beliefs[index - 1].id}/alternatives`;
  }

  return (
    <div>
      <Form onSubmit={props.handleSubmit}>
        <ControlLabel>
          What evidence is there that&nbsp;
          {lowerCaseFirstLetter(belief.description)}?
        </ControlLabel>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Evidence"
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
      <List value={props.evidence} remove={props.remove} />
      <Pager>
        <PagerLink to={previousPath} previous text={previousText} />
        <PagerLink
          to={`/beliefs/${beliefId}/alternatives`}
          text="Alternatives"
        />
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
    const { state, props } = this;
    return (
      <Presentation
        belief={props.belief}
        beliefs={props.beliefs}
        handleSubmit={this.handleSubmit}
        description={state.description}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        evidence={props.evidenceQuery.getEvidenceForBelief}
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

    this.props.createEvidenceMutation({
      variables: {
        description: this.state.description,
        beliefId: this.props.belief.id
      }
    }).then(() => {
      this.setState({ description: "", isSaving: false });
    });
  },
  remove(id) {
    this.props.deleteEvidenceMutation({
      variables: { id }
    })
  }
});

// TODO Investigate how to merge into query done by Belief.js
const EVIDENCE_QUERY = gql`
  query EvidenceQuery($beliefId: ID!) {
    getEvidenceForBelief(beliefId: $beliefId) {
      id
      description
    }
  }
`

const CREATE_EVIDENCE_MUTATION = gql`
  mutation CreateEvidenceMutation($beliefId: ID!, $description: String!) {
    createEvidence(beliefId: $beliefId, description: $description) {
      id
    }
  }
`

const DELETE_EVIDENCE_MUTATION = gql`
  mutation DeleteEvidenceMutation($id: ID!) {
    deleteEvidence(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(EVIDENCE_QUERY, {
    name: 'evidenceQuery',
    options: props => ({ variables: { beliefId: props.belief.id } })
  }),
  graphql(CREATE_EVIDENCE_MUTATION, {
    name: 'createEvidenceMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'EvidenceQuery'
      ],
    }
  }),
  graphql(DELETE_EVIDENCE_MUTATION, {
    name: 'deleteEvidenceMutation',
    options: {
      // TODO Something more efficient like a cache update or optimistic update
      refetchQueries: [
        'EvidenceQuery'
      ],
    }
  })
)(Container)