import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager, PageItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import List from './list';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      description: ''
    };
  },
  componentWillMount() {
    this.bindAsArray(this.props.beliefRef.child('implications'), 'implications');
  },
  render() {
    const belief = this.props.belief;
    const implications = this.state.implications;

    return(belief ?
      <div>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What are the implications if&nbsp;
            {lowerCaseFirstLetter(belief.description)}?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Implication' 
                           value={this.state.description}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>
                  Add
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        <List value={this.state.implications}/>
        <Pager>
          <PageItem previous onClick={this.handleBack}>
            &larr; Alternatives
          </PageItem>
          <PageItem next onClick={this.handleNext}>
            Next Belief &rarr;
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

    this.firebaseRefs.implications.push({
      description: this.state.description
    }).then(() => {
      this.setState({description: '', isSaving: false});
    });
  },
  handleBack(e) {
    e.preventDefault();
    this.props.router.push(`/beliefs/${this.props.beliefRef.key}/alternatives`);
  },
  handleNext(e) {
    e.preventDefault();
    this.props.router.push(`/beliefs/${this.props.beliefRef.key}/implications`);
  }
}));