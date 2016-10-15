import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import { BrowserRouter, Match, Link, Redirect } from 'react-router';

import Login from './Login';
import Register from './Register';
import Adversities from './Adversities';
import Adversity from './Adversity';
import Belief from './Belief';

import firebase from './firebase';

import logo from './logo.svg';

const auth = firebase.auth();
const usersRef = firebase.database().ref('users');

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

          <div className='container'>
            <Match pattern="/login" render={() => <Login userRef={userRef}/>}/>
            <Match pattern="/register" component={Register}/>

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