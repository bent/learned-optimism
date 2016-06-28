import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, ButtonToolbar, FormControl, Form, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import { withRouter } from 'react-router';

import adversitiesRef from './adversitiesRef';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      evidenceDescription: ''
    };
  },
  componentWillMount() {
    const beliefRef = 
      firebase.database().ref('beliefs').child(this.props.params.beliefId);
    const evidenceRef = 
      beliefRef.child('evidence');
    this.bindAsObject(beliefRef, 'belief');
    this.bindAsArray(evidenceRef, 'evidence');

    beliefRef.once('value').then(snapshot => {
      const adversityId = snapshot.val().adversityId;
      const adversityRef = adversitiesRef.child(adversityId);
      this.bindAsObject(adversityRef, 'adversity');
    });
  },
  render() {
    const adversity = this.state.adversity;
    const belief = this.state.belief;
    const evidence = this.state.evidence;

    return(adversity ? 
      <div>
        <h2>{adversity.description}</h2>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What evidence is there that {belief.description}?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Evidence' 
                           value={this.state.evidenceDescription}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>
                  Add
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        {evidence && 
          <div className="list-group">
            {evidence.map(evidenceItem => {
              return (
                <div className="list-group-item" key={evidenceItem['.key']}>
                  {evidenceItem.description}
                </div>
              );
            })}
          </div>
        }
      </div>
      :
      <div/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({evidenceDescription: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSaving: true});

    this.firebaseRefs.evidence.push({
      description: this.state.evidenceDescription
    }).then(() => {
      this.setState({
        evidenceDescription: '', isSaving: false
      });
    });
  }
}));