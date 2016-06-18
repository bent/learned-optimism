import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import Adversities from './adversities';
import Adversity from './adversity';

const App = React.createClass({
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Learned Optimism</a>
          </div>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
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
), document.getElementById('app'));