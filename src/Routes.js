import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './App';
import Login from './Login';
import Register from './Register';
import Adversities from './Adversities';
import Adversity from './Adversity';
import Belief from './Belief';
import Evidence from './Evidence';
import Alternatives from './Alternatives';
import Implications from './Implications';

module.exports = React.createClass({
  render() {
    return (
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
      </Router>
    );
  }
});
