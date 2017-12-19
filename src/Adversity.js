import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  ButtonToolbar,
  FormControl,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "react-spinner";
import firebase from "firebase";
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import userRefFor from "./userRef";
import AdversityPanel from "./AdversityPanel";
import List from "./List";

const Presentation = ({ beliefs, ...props }) =>
  props.loaded
    ? <AdversityPanel value={props.adversity}>
        <Form onSubmit={props.handleSubmit}>
          <ControlLabel>
            What beliefs do I have about this adversity?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Belief"
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
        {beliefs.length > 0
          ? <ButtonToolbar>
              <Link
                to={`/beliefs/${beliefs[0][".key"]}/evidence`}
                className="btn btn-primary btn-block"
              >
                Start Disputation
              </Link>
            </ButtonToolbar>
          : <div />}
      </AdversityPanel>
    : <Spinner />;

const Container = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    user: React.PropTypes.instanceOf(firebase.User).isRequired,
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
    const { Adversity } = this.props.adversityQuery

    return (
      <Presentation
        loaded={!this.props.adversityQuery.loading}
        adversity={Adversity}
        handleSubmit={this.handleSubmit}
        beliefDescription={state.beliefDescription}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        beliefs={Adversity && Adversity.beliefs}
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

    this.firebaseRefs.beliefs
      .push({
        adversityId: this.state.adversity[".key"],
        description: this.state.beliefDescription
      })
      .then(() => {
        this.setState({
          beliefDescription: "",
          isSaving: false
        });
      });
  },
  remove(beliefId) {
    userRefFor(this.props.user).child("beliefs").child(beliefId).remove()
  }
});

const ADVERSITY_QUERY = gql`
  query AdversityQuery($id: ID!) {
    Adversity(id: $id) {
      description
      beliefs {
        id
        description
      }
    }
  }
`

export default compose(
  graphql(ADVERSITY_QUERY, { 
    name: 'adversityQuery',
    options: props => ({ variables: { id: props.match.params.adversityId } })
  })
)(Container)
