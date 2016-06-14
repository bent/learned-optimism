import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

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
  getInitialState: function() {
    return {
      data: [
        {id: 1, description: 'cat died'}, 
        {id: 2, description: "didn't get that promotion"}
      ], 
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
          {this.state.data.map(adversity => (
            <li key={adversity.id}>{adversity.description}</li>
          ))}
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
    this.setState({
      data: this.state.data.concat({id: Date.now(), description: this.state.description}),
      description: ''
    });
  }
}); 

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Adversities}/>
    </Route>
      
  </Router>
), document.getElementById('example'));