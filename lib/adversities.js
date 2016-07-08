import React from 'react';
import ReactDOM from 'react-dom';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, FormGroup, InputGroup } from 'react-bootstrap';
import { Link, withRouter } from 'react-router';

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
    if (nextProps.userRef != this.props.userRef) {
      if (this.firebaseRefs.adversities) this.unbind('adversities');
      this._loadData(nextProps.userRef);
    }
  },
  render() {
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
          {this.state.adversities.map(adversity => {
            const id = adversity['.key']; 
            return (
              <Link key={id} 
                  className="list-group-item" 
                  to={`/adversities/${id}`}>
                {adversity.description}
              </Link>
            );
          })}
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
    }
  }
}));