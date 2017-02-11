import React from 'react';
import { Route, Redirect } from 'react-router-dom'; 
import matchPropTypes from './matchPropTypes';

/**
 * If we have a logged-in user, redirect to the home page. Otherwise, display the component.
 */
const MatchWhenUnauthorized = ({ component: Component, userRef, ...rest }) => (
  <Route {...rest} render={props => (
    userRef ? <Redirect to={{pathname: '/'}}/> : <Component userRef={userRef} {...props}/>
  )}/>
)

MatchWhenUnauthorized.propTypes = matchPropTypes;

export default MatchWhenUnauthorized;