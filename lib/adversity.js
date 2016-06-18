import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import adversitiesRef from './adversitiesRef';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      beliefDescription: ''
    };
  },
  componentWillMount: function() {
    const adversityRef = adversitiesRef.child(this.props.params.adversityId);
    this.bindAsObject(adversityRef, 'adversity');
    this.bindAsArray(adversityRef.child('beliefs'), 'beliefs');
  },
  render: function() {
    const adversity = this.state.adversity;
    const beliefs = this.state.beliefs;

    return(adversity ? 
      <div>
        <h2>{adversity.description}</h2>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>What beliefs do I have about this adversity?</ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Belief' 
                           value={this.state.beliefDescription}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit">Add</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        {beliefs ? 
          <ul>
            {beliefs.map(belief => {
              return (
                <li key={belief['.key']}>
                  {belief.description}
                </li>
              );
            })}
          </ul>
          :
          <div/>
        }
      </div>
      :
      <div/>
    );
  },
  handleChange: function(e) {
    e.preventDefault();
    this.setState({beliefDescription: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.firebaseRefs.beliefs.push({
      description: this.state.beliefDescription
    });
    this.setState({
      beliefDescription: ''
    });
  }
});