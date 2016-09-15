import React from 'react';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup } from 'react-bootstrap';
import { Link, withRouter } from 'react-router';
import Spinner from 'react-spinner';

module.exports = withRouter(React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      description: ''
    };
  },
  componentWillMount() {
    if (this.props.userRef) {
      this._loadData(this.props.userRef);
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.userRef !== this.props.userRef) {
      if (this.firebaseRefs.adversities) this.unbind('adversities');
      this._loadData(nextProps.userRef);
    }
  },
  render() {
    const {adversities} = this.state;

    return (
      this.props.userRef ? <div>
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
          {this.state.loaded ? adversities.map(adversity => {
            const id = adversity['.key']; 
            return (
              <Link key={id} 
                  className="list-group-item" 
                  to={`/adversities/${id}`}>
                {adversity.description}
              </Link>
            );
          }) : <Spinner/> }
        </div>
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
    this.firebaseRefs.adversities.push({
      description: this.state.description
    }).then(adversity => {
      this.props.router.push(`/adversities/${adversity.key}`);
    });
  },
  _loadData(userRef) {
    if (userRef) {
      this.bindAsArray(userRef.child('adversities'), 'adversities');    
      // Once the data has loaded for the first time, stop displaying the spinner
      this.firebaseRefs.adversities.once('value').then(() => this.setState({loaded: true}));
    }
  }
}));