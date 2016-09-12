import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import 'react-spinner/react-spinner.css';

import App from './App';
import Login from './login';
import Register from './register';
import Adversities from './adversities';
import Adversity from './adversity';
import Belief from './belief';
import Evidence from './evidence';
import Alternatives from './alternatives';
import Implications from './implications';

import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>
      <IndexRoute component={Adversities}/>
      <Route path="adversities/:adversityId" component={Adversity}/>
      <Route path="beliefs/:beliefId" component={Belief}>
        <Route path="evidence" component={Evidence}/>
        <Route path="alternatives" component={Alternatives}/>
        <Route path="implications" component={Implications}/>
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
);
