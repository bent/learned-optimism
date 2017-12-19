import React from "react";
import ReactFireMixin from "reactfire";
import Spinner from "react-spinner";
import firebase from "firebase";

import { Route } from "react-router-dom";

import Evidence from "./Evidence";
import Alternatives from "./Alternatives";
import Implications from "./Implications";
import AdversityPanel from "./AdversityPanel";

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Presentation = ({ belief, beliefs, path, ...props }) => {
  if (belief) {
    const disputationProps = {
      belief,
      beliefs
    };

    return (
      <AdversityPanel value={props.adversity}>
        <Route
          path={`${path}/evidence`}
          render={() => <Evidence {...disputationProps} />}
        />
        <Route
          path={`${path}/alternatives`}
          render={() => <Alternatives {...disputationProps} />}
        />
        <Route
          path={`${path}/implications`}
          render={() => <Implications {...disputationProps} />}
        />
      </AdversityPanel>
    );
  } else {
    return <Spinner />;
  }
};

const Container = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        beliefId: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    user: React.PropTypes.instanceOf(firebase.User).isRequired
  },
  componentWillReceiveProps(nextProps) {
    const { beliefId } = nextProps.match.params;

    if (beliefId !== this.props.match.params.beliefId) {
      this.props.beliefQuery.refetch({id: beliefId})
    }
  },
  render() {
    const { Belief } = this.props.beliefQuery;
    const adversity = Belief && Belief.adversity

    return (
      <Presentation
        beliefId={this.props.match.params.beliefId}
        belief={Belief}
        beliefs={adversity && adversity.beliefs}
        path={this.props.match.path}
        adversity={adversity}
      />
    );
  }
});

const BELIEF_QUERY = gql`
  query BeliefQuery($id: ID!) {
    Belief(id: $id) {
      id
      description
      adversity {
        id
        description
        beliefs {
          id
        }
      }
    }
  }
`

export default graphql(BELIEF_QUERY, {
  name: 'beliefQuery',
  options: props => ({ variables: { id: props.match.params.beliefId } })
})(Container)