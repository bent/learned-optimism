import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';
import Adversities from './adversities';
import Adversity from './adversity';
import Login from './login';
import Register from './register';
import Evidence from './evidence';
import Alternatives from './alternatives';
import Belief from './belief';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>
      <IndexRoute component={Adversities}/>
      <Route path="adversities/:adversityId" component={Adversity}/>
      <Route path="beliefs/:beliefId" component={Belief}>
        <Route path="evidence" component={Evidence}/>
        <Route path="alternatives" component={Alternatives}/>
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));