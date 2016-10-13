import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import { BrowserRouter, Match, Link } from 'react-router';

import Login from './Login';
import Register from './Register';
import Adversities from './Adversities';
import Adversity from './Adversity';
import Belief from './Belief';

import firebase from './firebase';
import history from './history';

import logo from './logo.svg';

const auth = firebase.auth();
const usersRef = firebase.database().ref('users');

module.exports = React.createClass({
  getInitialState() {
    return {
      userRef: auth.currentUser && usersRef.child(auth.currentUser.uid),
      navbarExpanded: false
    };
  },
  componentWillMount() {
    this.unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      this.setState({
        userRef: user && usersRef.child(user.uid)
      });
    });
  },
  componentWillUnmount() {
    this.unsubscribeAuthStateChanged();
  },
  render() {
    const userRef = this.state.userRef;

    return (
      <BrowserRouter>
        <div>
          <Navbar expanded={this.state.navbarExpanded} onToggle={this.toggle}>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/"><img src={logo} role="presentation"/><span>Learned Optimism</span></Link>
              </Navbar.Brand>
              {userRef && <Navbar.Toggle/>}
            </Navbar.Header>
            {userRef && <Navbar.Collapse>
              <Nav pullRight>
                <NavItem onClick={this.logout}>Logout</NavItem>
              </Nav>
            </Navbar.Collapse>}
          </Navbar>

          <div className='container'>
            <Match pattern="/login" render={() => <Login setUser={this.setUser}/>}/>
            <Match pattern="/register" component={Register}/>
            <Match exactly pattern="/" render={() => <Adversities userRef={userRef}/>}/>
            <Match 
              pattern="/adversities/:adversityId" 
              render={props => <Adversity {...props} userRef={userRef}/>}
            />
            <Match 
              pattern="/beliefs/:beliefId" 
              render={props => <Belief {...props} userRef={userRef}/>}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  },
  toggle() {
    this.setState({navbarExpanded: !this.state.navbarExpanded});
  },
  setUser(user) {
    this.setState({userRef: user && usersRef.child(user.uid)});
  },
  logout() {
    auth.signOut().then(() => {
      history.push('/login');
      this.setState({userRef: undefined, navbarExpanded: false});
    }).catch(error => {
      console.log(error);
    });
  }
});