import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager } from 'react-bootstrap';

import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import disputationPropTypes from './disputationPropTypes'
import List from './List';
import PagerLink from './PagerLink';

export default React.createClass({
  mixins: [ReactFireMixin],
  propTypes: disputationPropTypes,
  getInitialState() {
    return {
      alternativeDescription: ''
    };
  },
  componentWillMount() {
    this.bindAsArray(this.props.beliefRef.child('alternatives'), 'alternatives');
  },
  render() {
    const {belief} = this.props;
    const beliefId = belief['.key'];

    return(
      <div>
        <Form onSubmit={this.handleSubmit}>
          <ControlLabel>
            What alternatives are there to&nbsp;
            {lowerCaseFirstLetter(belief.description)}?
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
        <List value={this.state.alternatives}/>
        <Pager>
          <PagerLink to={`/beliefs/${beliefId}/evidence`} previous text='Evidence'/>
          <PagerLink to={`/beliefs/${beliefId}/implications`} text='Implications'/>
        </Pager>
      </div>
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
  }
});