import React from 'react';
import { Link } from 'react-router';

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Learned Optimism</Link>
          </div>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
});