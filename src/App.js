import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import firebase from './firebase';

import logo from './logo.svg';

const auth = firebase.auth();
const usersRef = firebase.database().ref('users');

module.exports = withRouter(React.createClass({
  getInitialState() {
    return {
      userRef: auth.currentUser && usersRef.child(auth.currenUser.uid),
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
    const children = this.props.children;
    const userRef = this.state.userRef;

    return (
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
          {children && React.cloneElement(children, {
            setUser: this.setUser,
            userRef: this.state.userRef
          })}
        </div>
      </div>
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
      this.props.router.push('/login');
      this.setState({userRef: undefined, navbarExpanded: false});
    }).catch(error => {
      console.log(error);
    });
  }
}));