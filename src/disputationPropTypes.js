import React from 'react';
import firebase from 'firebase';

module.exports = {
  belief: React.PropTypes.shape({
    '.key': React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired
  }).isRequired,
  beliefRef: React.PropTypes.instanceOf(firebase.database.Reference).isRequired
};