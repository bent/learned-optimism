import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, ButtonToolbar, FormControl, Form, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import adversitiesRef from './adversitiesRef';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      beliefDescription: ''
    };
  },
  componentWillMount: function() {
    const adversityId = this.props.params.adversityId;
    const adversityRef = adversitiesRef.child(adversityId);
    const beliefsRef = firebase.database().ref('beliefs').orderByChild('adversityId').equalTo(adversityId);
    this.bindAsObject(adversityRef, 'adversity');
    this.bindAsArray(beliefsRef, 'beliefs');
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
          <div className="list-group">
            {beliefs.map(belief => {
              return (
                <div className="list-group-item" key={belief['.key']}>
                  {belief.description}
                </div>
              );
            })}
          </div>
          :
          <div/>
        }
        <ButtonToolbar>
          <Button bsStyle="primary">Disputation</Button>
        </ButtonToolbar>
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
      adversityId: this.state.adversity['.key'],
      description: this.state.beliefDescription
    });
    this.setState({
      beliefDescription: ''
    });
  }
});