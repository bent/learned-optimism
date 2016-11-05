import React from 'react';
import { Link } from 'react-router';

const Component = ({to, previous, text}) => (
  <Link to={to}>{({onClick}) =>
    // Ideally we would use Pager.Item from react-bootstrap. However, passing onClick through to it
    // doesn't seem to work, so we're manually reproducing the markup for it here.
    <li className={previous ? 'previous' : 'next'}>
      <a href onClick={onClick}>
        {previous && <span>&larr;</span>} {text} {!previous && <span>&rarr;</span>}
      </a>
    </li>
  }</Link>
);

Component.propTypes = {
  to: React.PropTypes.string.isRequired,
  previous: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired
};

export default Component;