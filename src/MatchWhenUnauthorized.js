import React from 'react';
import { Match, Redirect } from 'react-router'; 
import matchPropTypes from './matchPropTypes';

const MatchWhenUnauthorized = ({ component: Component, userRef, ...rest }) => (
  <Match {...rest} render={props => (
    // If we have a logged-in user, redirect to the home page. Otherwise, display the component.
    userRef ? <Redirect to={{pathname: '/'}}/> : <Component userRef={userRef} {...props}/>
  )}/>
)

MatchWhenUnauthorized.propTypes = matchPropTypes;

export default MatchWhenUnauthorized;