import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';

import 'react-spinner/react-spinner.css';

import App from './App';
import Login from './Login';
import Register from './Register';
import Adversities from './Adversities';
import Adversity from './Adversity';
import Belief from './Belief';
import Evidence from './Evidence';
import Alternatives from './Alternatives';
import Implications from './Implications';

import './bootstrap.css';
import './index.css';

const redirectToLoginIfNotLoggedIn = (nextState, replace) => {
  if (nextState.location.pathname !== '/login' && nextState.location.pathname !== '/register' && !firebase.auth().currentUser) {
    replace('/login');
  }
};

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App} onEnter={redirectToLoginIfNotLoggedIn}>
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
