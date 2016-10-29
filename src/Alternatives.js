import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager } from 'react-bootstrap';
import { Link } from 'react-router';

import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import disputationPropTypes from './disputationPropTypes'
import List from './List';

module.exports = React.createClass({
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
          <Link to={`/beliefs/${beliefId}/evidence`}>{({onClick}) =>
            <li className="previous">
              <a href onClick={onClick}>&larr; Evidence</a>
            </li>
          }</Link>
          <Link to={`/beliefs/${beliefId}/implications`}>{({onClick}) =>
            <li className="next">
              <a href onClick={onClick}>Implications &rarr;</a>
            </li>
          }</Link>
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