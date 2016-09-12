import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager, PageItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

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
    const beliefId = belief['.key'];
    const beliefs = this.props.beliefs;
    const index = beliefs.findIndex(b => b['.key'] === beliefId);
    if (index < 0) throw new Error(`Belief with ID ${beliefId} not found`);
    const createHref = this.props.router.createHref;

    let nextText = 'Finish';
    let nextPath = `/adversities/${belief.adversityId}`;

    if (index < (beliefs.length - 1)) {
      nextText = 'Next Belief';
      nextPath = `/beliefs/${beliefs[index + 1]['.key']}/evidence`;
    }

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
          <PageItem previous href={createHref(`/beliefs/${beliefId}/alternatives`)}>
            &larr; Alternatives
          </PageItem>
          <PageItem next href={createHref(nextPath)}>
            {nextText} &rarr;
          </PageItem>
        </Pager>
      </div>
      :
      <div/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({description: e.target.value});
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