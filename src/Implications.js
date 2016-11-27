import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager } from 'react-bootstrap';

import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import List from './List';
import disputationPropTypes from './disputationPropTypes';
import PagerLink from './PagerLink';

export default React.createClass({
  propTypes: disputationPropTypes,
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

    let nextText = 'Finish';
    let nextPath = `/adversities/${belief.adversityId}`;

    if (index < (beliefs.length - 1)) {
      nextText = 'Next Belief';
      nextPath = `/beliefs/${beliefs[index + 1]['.key']}/evidence`;
    }

    return(
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
          <PagerLink to={`/beliefs/${beliefId}/alternatives`} previous text='Alternatives'/>
          <PagerLink to={nextPath} text={nextText}/>
        </Pager>
      </div>
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
  }
});