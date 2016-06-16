import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire';

firebase.initializeApp({
  apiKey: "AIzaSyCyOJbtSPGfyI7_rjfxPNSVDh2DwUb4LnI",
  authDomain: "learned-optimism-64fce.firebaseapp.com",
  databaseURL: "https://learned-optimism-64fce.firebaseio.com",
  storageBucket: "",
});

const adversitiesRef = firebase.database().ref('adversities');

const App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Learned Optimism</h1>
        {this.props.children}
      </div>
    );
  }
});

const Adversities = React.createClass({
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
        <form onSubmit={this.handleSubmit}>
          <input type='text' 
                 placeholder='Adversity' 
                 value={this.state.description}
                 onChange={this.handleChange}/>
          <input type="submit" value="Go" />
        </form>
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
        <form onSubmit={this.handleSubmit}>
          <input type='text' 
                 placeholder='Belief' 
                 value={this.state.beliefDescription}
                 onChange={this.handleChange}/>
          <input type="submit" value="Add" />
        </form>
        {beliefs ? 
          <ul>
            {beliefs.map(belief => {
              return (
                <li key={belief['.key']}>
                  <Link to={`/adversities/${id}/beliefs/`}>{belief.description}</Link>
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
), document.getElementById('example'));