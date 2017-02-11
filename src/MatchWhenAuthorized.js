import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import matchPropTypes from './matchPropTypes';

/**
 * If we have a logged-in user, display the component, otherwise redirect to login page.
 */
const MatchWhenAuthorized = ({ component: Component, userRef, ...rest }) => (
  <Route {...rest} render={props => (
    userRef ? <Component userRef={userRef} {...props}/> : <Redirect to={{pathname: '/login'}}/>
  )}/>
)

MatchWhenAuthorized.propTypes = matchPropTypes;

export default MatchWhenAuthorized;