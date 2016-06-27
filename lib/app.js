import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import firebase from './firebase';

const auth = firebase.auth();

module.exports = withRouter(React.createClass({
  getInitialState() {
    return {
      user: auth.currentUser,
      navbarExpanded: false
    };
  },
  componentWillMount() {
    this.unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      this.setState({
        user: user
      });
    });
  },
  componentWillUnmount() {
    this.unsubscribeAuthStateChanged();
  },
  render() {
    const children = this.props.children;
    const user = this.state.user;

    return (
      <div>
        <Navbar expanded={this.state.navbarExpanded} onToggle={this.toggle}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Learned Optimism</Link>
            </Navbar.Brand>
            {user && <Navbar.Toggle/>}
          </Navbar.Header>
          {user && <Navbar.Collapse>
            <Nav pullRight>
              <NavItem onClick={this.logout}>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>}
        </Navbar>
        <div className='container'>
          {children && React.cloneElement(children, {
            setUser: this.setUser,
            user: this.state.user
          })}
        </div>
      </div>
    );
  },
  toggle() {
    this.setState({navbarExpanded: !this.state.navbarExpanded});
  },
  setUser(user) {
    this.setState({user: user});
  },
  logout() {
    auth.signOut().then(() => {
      this.setState({user: undefined, navbarExpanded: false});
      this.props.router.push('/login');
    }).catch(error => {
      console.log(error);
    });
  }
}));