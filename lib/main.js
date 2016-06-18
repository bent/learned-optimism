import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import Adversities from './adversities';
import Adversity from './adversity';

const App = (props) => (
  <div>
    <nav className="navbar navbar-default">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">Learned Optimism</Link>
      </div>
    </nav>
    <div className='container'>
      {props.children}
    </div>
  </div>
);

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Adversities}/>
      <Route path="adversities/:adversityId" component={Adversity}/>
    </Route>
  </Router>
), document.getElementById('app'));