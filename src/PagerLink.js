import React from 'react';
import { Link } from 'react-router-dom';

const Component = ({to, previous, text}) => (
  // Ideally we would use Pager.Item from react-bootstrap. However, passing onClick through to it
  // doesn't seem to work, so we're manually reproducing the markup for it here.
  <li className={previous ? 'previous' : 'next'}>
    <Link to={to}>
      {previous && <span>&larr;</span>} {text} {!previous && <span>&rarr;</span>}
    </Link>
  </li>
);

Component.propTypes = {
  to: React.PropTypes.string.isRequired,
  previous: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired
};

export default Component;