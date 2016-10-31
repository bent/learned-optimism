import React from 'react';
import { Match, Redirect } from 'react-router';
import matchPropTypes from './matchPropTypes';

const MatchWhenAuthorized = ({ component: Component, userRef, ...rest }) => (
  <Match {...rest} render={props => (
    // If we have a logged-in user, display the component, otherwise redirect to login
    userRef ? <Component userRef={userRef} {...props}/> : <Redirect to={{pathname: '/login'}}/>
  )}/>
)

MatchWhenAuthorized.propTypes = matchPropTypes;

export default MatchWhenAuthorized;