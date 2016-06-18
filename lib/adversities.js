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
        <ul>
          {this.state.adversities.map(adversity => {
            const id = adversity['.key']; 
            return (
              <li key={id}>
                <Link to={`/adversities/${id}`}>{adversity.description}</Link>
              </li>
            );
          })}
        </ul>
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