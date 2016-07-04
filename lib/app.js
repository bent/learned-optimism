import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import firebase from './firebase';

const auth = firebase.auth();

module.exports = withRouter(React.createClass({
  getInitialState() {
    return {
      userRef: auth.currentUser && firebase.database().ref('users').child(auth.currenUser.uid),
      navbarExpanded: false
    };
  },
  componentWillMount() {
    this.unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      this.setState({
        userRef: firebase.database().ref('users').child(user.uid)
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
              <Link to="/">Learned Optimism</Link>
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
    this.setState({userRef: user && firebase.database().ref('users').child(user.uid)});
  },
  logout() {
    auth.signOut().then(() => {
      this.setState({userRef: undefined, navbarExpanded: false});
      this.props.router.push('/login');
    }).catch(error => {
      console.log(error);
    });
  }
}));