import React from 'react';
import firebase from 'firebase';

/**
 * PropTypes shared by components that check authorization status
 */
export default {
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