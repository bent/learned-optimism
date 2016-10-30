import React from 'react';
import { Match, Redirect } from 'react-router';

const MatchWhenAuthorized = ({ component: Component, userRef, ...rest }) => (
  <Match {...rest} render={props => (
    // If we have a logged-in user,
    userRef ? (
      <Component userRef={userRef} {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

module.exports = MatchWhenAuthorized;