import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, ButtonToolbar, FormControl, Form, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import { withRouter } from 'react-router';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import AdversityPanel from './adversityPanel';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      beliefDescription: ''
    };
  },
  componentWillMount() {
    const adversityId = this.props.params.adversityId;

    this.bindAsObject(adversitiesRef.child(adversityId), 'adversity');
    this.bindAsArray(
      beliefsRef.orderByChild('adversityId').equalTo(adversityId), 'beliefs'
    );
  },
  render() {
    const beliefs = this.state.beliefs;

    return (
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
        {beliefs &&
          <div className="list-group">
            {beliefs.map(belief => {
              return (
                <div className="list-group-item" key={belief['.key']}>
                  {belief.description}
                </div>
              );
            })}
          </div>
        }
        <ButtonToolbar>
          <Button onClick={this.startDisputation} 
                  bsStyle="primary" 
                  disabled={beliefs.length < 1} 
                  block>
            Start Disputation
          </Button>
        </ButtonToolbar>
      </AdversityPanel>
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
  }
}));