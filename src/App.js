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
      userRef: auth.currentUser && usersRef.child(auth.currentUser.uid),
      navbarExpanded: false
    };
  },
  componentWillMount() {
    this.unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      try {
        console.debug('user=' + user);
        if (user) {
          this.setState({userRef: usersRef.child(user.uid)});
          this.props.router.push('/');
        } else {
          if (this.props.location.pathname !== '/login') {
            this.props.router.push('/login');
            this.setState({userRef: undefined});
          }
        }
      } catch (error) {
        console.error(error);
      }
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
            userRef: this.state.userRef
          })}
        </div>
      </div>
    );
  },
  toggle() {
    this.setState({navbarExpanded: !this.state.navbarExpanded});
  },
  logout() {
    this.setState({navbarExpanded: false});
    auth.signOut().catch(error => {
      console.log(error);
    });
  }
}));