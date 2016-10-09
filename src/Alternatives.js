import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup, ControlLabel, Pager } from 'react-bootstrap';
import { withRouter } from 'react-router';
import firebase from 'firebase';

import lowerCaseFirstLetter from './lowerCaseFirstLetter';
import List from './List';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    belief: React.PropTypes.shape({
      '.key': React.PropTypes.string.isRequired
    }).isRequired,
    router: React.PropTypes.shape({
      createHref: React.PropTypes.func.isRequired
    }).isRequired,
    beliefRef: React.PropTypes.instanceOf(firebase.database.Reference).isRequired
  },
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
    const {createHref} = this.props.router;

    return(belief ?
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
          <Pager.Item previous href={createHref(`/beliefs/${beliefId}/evidence`)}>
            &larr; Evidence
          </Pager.Item>
          <Pager.Item next href={createHref(`/beliefs/${beliefId}/implications`)}>
            Implications &rarr;
          </Pager.Item>
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
  }
}));