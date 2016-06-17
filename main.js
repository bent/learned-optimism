import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactFireMixin from 'reactfire';
import { Button, FormControl, Form } from 'react-bootstrap';
import adversitiesRef from './adversitiesRef';

import Adversities from './adversities';

const App = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

const Adversity = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      beliefDescription: ''
    };
  },
  componentWillMount: function() {
    const adversityRef = adversitiesRef.child(this.props.params.adversityId);
    this.bindAsObject(adversityRef, 'adversity');
    this.bindAsArray(adversityRef.child('beliefs'), 'beliefs');
  },
  render: function() {
    const adversity = this.state.adversity;
    const beliefs = this.state.beliefs;

    return(adversity ? 
      <div>
        <h2>{adversity.description}</h2>
        <span>What beliefs do you have about this adversity?</span>
        <Form inline>
          <FormControl type='text' 
                 placeholder='Belief' 
                 value={this.state.beliefDescription}
                 onChange={this.handleChange}/>
          <Button onClick={this.handleSubmit}>Add</Button>
        </Form>
        {beliefs ? 
          <ul>
            {beliefs.map(belief => {
              return (
                <li key={belief['.key']}>
                  {belief.description}
                </li>
              );
            })}
          </ul>
          :
          <div/>
        }
      </div>
      :
      <div/>
    );
  },
  handleChange: function(e) {
    e.preventDefault();
    this.setState({beliefDescription: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.firebaseRefs.beliefs.push({
      description: this.state.beliefDescription
    });
    this.setState({
      beliefDescription: ''
    });
  }
});

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Adversities}/>
      <Route path="adversities/:adversityId" component={Adversity}/>
    </Route>
  </Router>
), document.getElementById('app'));