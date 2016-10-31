import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Spinner from 'react-spinner';
import { BrowserRouter, Match, Link } from 'react-router';

import Login from './Login';
import Register from './Register';
import Adversities from './Adversities';
import Adversity from './Adversity';
import Belief from './Belief';
import MatchWhenAuthorized from './MatchWhenAuthorized';

import firebase from './firebase';

import logo from './logo.svg';

const auth = firebase.auth();
const usersRef = firebase.database().ref('users');

export default React.createClass({
  getInitialState() {
    return {
      userRef: undefined, // `undefined` signifies that we don't know yet if we are logged in or not
      navbarExpanded: false
    };
  },
  componentWillMount() {
    this.unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      this.setState({
        userRef: user ? usersRef.child(user.uid) : user
      });
    });
  },
  componentWillUnmount() {
    this.unsubscribeAuthStateChanged();
  },
  render() {
    const { userRef } = this.state;

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

          { 
          // If we know for sure whether we are logged-in or not, try to match the route. Otherwise 
          // just show a spinner.
          userRef !== undefined ? 
            <div className='container'>
              <Match pattern="/login" render={() => <Login userRef={userRef}/>}/>
              <Match pattern="/register" render={() => <Register userRef={userRef}/>}/>

              <MatchWhenAuthorized exactly userRef={userRef} pattern="/" component={Adversities}/>
              <MatchWhenAuthorized 
                userRef={userRef} 
                pattern="/adversities/:adversityId" 
                component={Adversity}
              />
              <MatchWhenAuthorized 
                userRef={userRef} 
                pattern="/beliefs/:beliefId" 
                component={Belief}
              />
            </div>
            :
            <Spinner/>
          }
        </div>
      </BrowserRouter>
    );
  },
  toggle() {
    this.setState(state => ({navbarExpanded: !state.navbarExpanded}));
  },
  logout() {
    auth.signOut().then(() => {
      this.setState({navbarExpanded: false});
    }).catch(error => {
      console.log(error);
    });
  }
});