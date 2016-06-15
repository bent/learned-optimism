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

var Adversities = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    var ref = firebase.database().ref('adversities');
    this.bindAsArray(ref, 'adversities');
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
  render: function() {
    return(
      <span>Adversity ID={this.props.params.adversityId}</span>
    );
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