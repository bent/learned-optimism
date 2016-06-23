import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Learned Optimism</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
});