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
import { graphql } from 'react-apollo'
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
  let previousPath = `/adversities/${belief.adversityId}`;

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
        evidence={this.props.evidenceQuery.allEvidences}
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

    this.firebaseRefs.evidence
      .push({
        description: this.state.description
      })
      .then(() => {
        this.setState({ description: "", isSaving: false });
      });
  },
  remove(id) {
    this.firebaseRefs.evidence.child(id).remove();
  }
});

// TODO Investigate how to merge into query done by Belief.js
const EVIDENCE_QUERY = gql`
  query EvidenceQuery($beliefId: ID!) {
    allEvidences(filter: {belief: {id: $beliefId}}) {
      description
    }
  }
`

export default graphql(EVIDENCE_QUERY, {
  name: 'evidenceQuery',
  options: props => ({ variables: { beliefId: props.belief.id } })
})(Container)