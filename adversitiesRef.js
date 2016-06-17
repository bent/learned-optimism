import firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyCyOJbtSPGfyI7_rjfxPNSVDh2DwUb4LnI",
  authDomain: "learned-optimism-64fce.firebaseapp.com",
  databaseURL: "https://learned-optimism-64fce.firebaseio.com",
  storageBucket: "",
});

module.exports = firebase.database().ref('adversities');