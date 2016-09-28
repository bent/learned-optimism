import React from 'react';
import { Button, ButtonToolbar, FormControl, Form, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Spinner from 'react-spinner';

import AdversityPanel from './AdversityPanel';
import List from './List';
import arrayFrom from './arrayFrom';

module.exports = withRouter(React.createClass({
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
    const adversityId = this.props.params.adversityId;
    const description = this.state.beliefDescription;

    this.props.userRef.child('beliefs').push({adversityId, description}).then(value => {
      this.setState(state => ({
        beliefDescription: '', 
        isSaving: false,
        beliefs: state.beliefs.concat({'.key': value.getKey(), adversityId, description})
      }));
    });
  },
  startDisputation() {
    this.props.router.push(`/beliefs/${this.state.beliefs[0]['.key']}/evidence`);
  },
  _loadData(userRef) {
    const adversityId = this.props.params.adversityId;

    // Once the data has loaded for the first time, stop displaying the spinner
    Promise.all([
      userRef.child('adversities').child(adversityId).once('value'),
      userRef.child('beliefs').orderByChild('adversityId').equalTo(adversityId).once('value')
    ]).then(values => {
      this.setState({
        loaded: true, adversity: values[0].val(), beliefs: arrayFrom(values[1])
      });
    });
  }
}));