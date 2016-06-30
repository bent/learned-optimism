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
      evidenceDescription: ''
    };
  },
  componentWillMount() {
    const beliefRef = 
      beliefsRef.child(this.props.params.beliefId);

    this.bindAsObject(beliefRef, 'belief');
    this.bindAsArray(beliefRef.child('evidence'), 'evidence');

  },
  render() {
    const evidence = this.state.evidence;

    return(
      <div>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What evidence is there that&nbsp;
            {lowerCaseFirstLetter(this.state.belief.description)}?
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
        <Pager>
          <PageItem previous href="#">&larr; Previous Page</PageItem>
          <PageItem next onClick={this.handleNext}>
            Alternatives &rarr;
          </PageItem>
        </Pager>
      </div>
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
      this.setState({evidenceDescription: '', isSaving: false});
    });
  },
  handleNext(e) {
    e.preventDefault();
    this.props.router.push(`/beliefs/${this.state.belief['.key']}/alternatives`);
  }
}));