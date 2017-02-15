import firebase from './firebase';

/**
 * Gets the Firebase database ref for a particular user
 */
export default function(user) {
  return firebase.database().ref('users').child(user.uid)
}