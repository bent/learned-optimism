import React from 'react';
import ReactDOM from 'react-dom';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router';

import adversitiesRef from './adversitiesRef';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    this.bindAsArray(adversitiesRef, 'adversities');
  },
  getInitialState: function() {
    return {
      description: ''
    };
  },
  render: function() {
    return (
      <div>
        <h1>Adversities</h1>
        <Form onSubmit={this.handleSubmit}>
          <InputGroup>
            <FormControl type='text' 
                   placeholder='Adversity' 
                   value={this.state.description}
                   onChange={this.handleChange}/>
            <InputGroup.Button>
              <Button type="submit">Go</Button>
            </InputGroup.Button>
          </InputGroup>
        </Form>
        <div className="list-group">
          {this.state.adversities.map(adversity => {
            return (
              <Link className="list-group-item" 
                    to={`/adversities/${adversity['.key']}`}>
                {adversity.description}
              </Link>
            );
          })}
        </div>
      </div>
    );
  },
  handleChange: function(e) {
    e.preventDefault();
    this.setState({description: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.firebaseRefs.adversities.push({
      description: this.state.description
    });
    this.setState({
      description: ''
    });
  }
});