import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager, PageItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';

function lowerCaseFirstLetter(string) {
  // If the string starts with "I ", just return it, otherwise convert first 
  // letter to lower case
  return string.substring(0, 2) == "I " ? string :
    string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      alternativeDescription: ''
    };
  },
  componentWillMount() {
    const beliefRef = 
      beliefsRef.child(this.props.params.beliefId);

    this.bindAsObject(beliefRef, 'belief');
    this.bindAsArray(beliefRef.child('alternatives'), 'alternatives');

    // Once we've got the belief, load the adversity that it belongs to
    beliefRef.once('value').then(snapshot => {
      this.bindAsObject(
        adversitiesRef.child(snapshot.val().adversityId), 'adversity'
      );
    });
  },
  render() {
    const adversity = this.state.adversity;
    const alternatives = this.state.alternatives;

    return(adversity ? 
      <div>
        <h2>{adversity.description}</h2>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What alternatives are there to&nbsp;
            {lowerCaseFirstLetter(this.state.belief.description)}?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Alternative' 
                           value={this.state.alternativeDescription}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>
                  Add
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        {alternatives && 
          <div className="list-group">
            {alternatives.map(alternative => {
              return (
                <div className="list-group-item" key={alternative['.key']}>
                  {alternative.description}
                </div>
              );
            })}
          </div>
        }
        <Pager>
          <PageItem previous href="#">&larr; Evidence</PageItem>
          <PageItem next onClick={this.handleNext}>
            Implications &rarr;
          </PageItem>
        </Pager>
      </div>
      :
      <div/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({alternativeDescription: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSaving: true});

    this.firebaseRefs.alternatives.push({
      description: this.state.alternativeDescription
    }).then(() => {
      this.setState({alternativeDescription: '', isSaving: false});
    });
  },
  handleNext(e) {
    e.preventDefault();
    this.props.router.push(`/beliefs/${this.state.belief['.key']}/implications`);
  }
}));