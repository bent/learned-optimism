import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup } from 'react-bootstrap';
import { Link, Redirect } from 'react-router';
import Spinner from 'react-spinner';
import firebase from 'firebase';

export default React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    userRef: React.PropTypes.instanceOf(firebase.database.Reference).isRequired
  },
  getInitialState() {
    return {
      description: ''
    };
  },
  componentWillMount() {
    this._loadData(this.props.userRef);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.userRef !== this.props.userRef) {
      if (this.firebaseRefs.adversities) this.unbind('adversities');
      this._loadData(nextProps.userRef);
    }
  },
  render() {
    const {adversities, newAdversityId} = this.state;

    return (
      this.state.loaded ? 
        // If we've just created a new adversity
        newAdversityId ?
          // Redirect to it
          <Redirect to={`/adversities/${newAdversityId}`}/>
          :
          // Otherwise just display the regular form
          <div>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <FormControl type='text' 
                         placeholder='Adversity' 
                         value={this.state.description}
                         onChange={this.handleChange}/>
                  <InputGroup.Button>
                    <Button type="submit" disabled={this.state.isSaving}>Go</Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </Form>
            <div className="list-group">
              {adversities.map(adversity => {
                const id = adversity['.key']; 

                return (
                  <Link key={id} className="adversity list-group-item" to={`/adversities/${id}`}>
                    {adversity.description}
                    <span onClick={e => {
                            e.preventDefault();
                            this.remove(id);
                          }}
                          className="remove glyphicon glyphicon-remove"/>
                  </Link>
                );
              })}
            </div>
          </div>
        : 
        <Spinner/>
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({description: e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSaving: true});
    this.firebaseRefs.adversities.push({
      description: this.state.description
    }).then(adversity => {
      this.setState({newAdversityId: adversity.key});
    });
  },
  _loadData(userRef) {
    this.bindAsArray(userRef.child('adversities'), 'adversities');    
    // Once the data has loaded for the first time, stop displaying the spinner
    this.firebaseRefs.adversities.once('value').then(() => this.setState({loaded: true}));
  },
  remove(adversityId) {
    this.firebaseRefs.adversities.child(adversityId).remove().catch(error => console.error(error));
  }
});