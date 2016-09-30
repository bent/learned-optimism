import React from 'react';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager } from 'react-bootstrap';
import { withRouter } from 'react-router';

import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import List from './List';

module.exports = withRouter(React.createClass({
  getInitialState() {
    return {
      description: '',
      evidence: this.props.evidence
    };
  },
  render() {
    const belief = this.props.belief;
    const beliefs = this.props.beliefs;
    const beliefId = belief['.key'];
    const index = beliefs.findIndex(b => b['.key'] === beliefId);
    if (index < 0) throw new Error(`Belief with ID ${beliefId} not found`);
    const createHref = this.props.router.createHref;

    let previousText = 'Beliefs';
    let previousPath = `/adversities/${belief.adversityId}`;

    if (index > 0) {
      previousText = 'Prev. Belief';
      previousPath = `/beliefs/${beliefs[index - 1]['.key']}/alternatives`;
    }

    return(belief ?
      <div>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What evidence is there that&nbsp;
            {lowerCaseFirstLetter(belief.description)}?
          </ControlLabel>
          <FormGroup>
            <InputGroup>
              <FormControl type='text' 
                           placeholder='Evidence' 
                           value={this.state.description}
                           onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button type="submit" disabled={this.state.isSaving}>Add</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Form>
        <List value={this.state.evidence}/>
        <Pager>
          <Pager.Item previous href={createHref(previousPath)}>
            &larr; {previousText}
          </Pager.Item>
          <Pager.Item next href={createHref(`/beliefs/${beliefId}/alternatives`)}>
            Alternatives &rarr;
          </Pager.Item>
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

    this.firebaseRefs.evidence.push({
      description: this.state.description
    }).then(() => {
      this.setState({description: '', isSaving: false});
    });
  }
}));