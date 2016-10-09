import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, ButtonToolbar, FormControl, Form, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Spinner from 'react-spinner';
import firebase from 'firebase';

import AdversityPanel from './AdversityPanel';
import List from './List';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    userRef: React.PropTypes.instanceOf(firebase.database.Reference),
    params: React.PropTypes.shape({
      adversityId: React.PropTypes.string.isRequired
    }).isRequired,
  },
  getInitialState() {
    return {
      beliefDescription: ''
    };
  },
  componentWillMount() {
    if (this.props.userRef) {
      this._loadData(this.props.userRef);
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.userRef !== this.props.userRef) {
      if (this.firebaseRefs.adversity) this.unbind('adversity');
      if (this.firebaseRefs.beliefs) this.unbind('beliefs');
      this._loadData(nextProps.userRef);
    }
  },
  render() {
    const {beliefs} = this.state;

    return (this.props.userRef && this.state.loaded ? 
      <AdversityPanel value={this.state.adversity}>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>What beliefs do I have about this adversity?</ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Belief' 
                           value={this.state.beliefDescription}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>
                  Add
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        <List value={beliefs}/>
        <ButtonToolbar>
          <Button onClick={this.startDisputation} 
                  bsStyle="primary" 
                  disabled={beliefs.length < 1} 
                  block>
            Start Disputation
          </Button>
        </ButtonToolbar>
      </AdversityPanel>:
      <Spinner/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({beliefDescription: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSaving: true});

    this.firebaseRefs.beliefs.push({
      adversityId: this.state.adversity['.key'],
      description: this.state.beliefDescription
    }).then(() => {
      this.setState({
        beliefDescription: '', isSaving: false
      });
    });
  },
  startDisputation() {
    this.props.router.push(`/beliefs/${this.state.beliefs[0]['.key']}/evidence`);
  },
  _loadData(userRef) {
    const adversityId = this.props.params.adversityId;

    this.bindAsObject(userRef.child('adversities').child(adversityId), 'adversity');
    this.bindAsArray(
      userRef.child('beliefs').orderByChild('adversityId').equalTo(adversityId), 'beliefs'
    );

    // Once the data has loaded for the first time, stop displaying the spinner
    Promise.all([
      this.firebaseRefs.adversity.once('value'),
      this.firebaseRefs.beliefs.once('value')
    ]).then(() => this.setState({loaded: true}));
  }
}));