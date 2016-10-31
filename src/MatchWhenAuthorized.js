import React from 'react';
import { Match, Redirect } from 'react-router';
import firebase from 'firebase';   

const MatchWhenAuthorized = ({ component: Component, userRef, ...rest }) => (
  <Match {...rest} render={props => (
    // If we have a logged-in user, display the component, otherwise redirect to login
    userRef ? <Component userRef={userRef} {...props}/> : <Redirect to={{pathname: '/login'}}/>
  )}/>
)

MatchWhenAuthorized.propTypes = {
  component: React.PropTypes.func.isRequired,
  userRef: (props, propName, componentName) => {
    const propValue = props[propName];

    if (propValue !== null && !(propValue instanceof firebase.database.Reference)) {
      return new Error(
        `Prop '${propName}' on component '${componentName} has invalid value '${propValue}'`
      );
    }
  }
};

export default MatchWhenAuthorized;