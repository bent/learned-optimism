import React from 'react';
import { Link } from 'react-router';

module.exports = (props) => (
  <div>
    <nav className="navbar navbar-default">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">Learned Optimism</Link>
      </div>
    </nav>
    <div className='container'>
      {props.children}
    </div>
  </div>
);