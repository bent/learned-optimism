import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

import firebase from './firebase';

module.exports = withRouter(React.createClass({
  getInitialState: function() {
    return {
      expanded: false
    };
  },
  render: function() {
    return (
      <div>
        <Navbar expanded={this.state.expanded} onToggle={this.toggle}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Learned Optimism</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem onClick={this.logout}>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  },
  toggle: function() {
    this.setState({expanded: !this.state.expanded});
  },
  logout: function() {
    firebase.auth().signOut().then(() => {
      this.setState({expanded: false});
      this.props.router.push('/login');
    }).catch(error => {
      console.log(error);
    });
  }
}));