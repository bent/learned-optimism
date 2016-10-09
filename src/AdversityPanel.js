import React from 'react';

const Component = props => {
  const adversity = props.value;

  return(adversity ?
    <div>
      <h2>{adversity.description}</h2>
      {props.children}
    </div>
    :
    <div/>
  );
};

Component.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.element
  ]).isRequired
};

module.exports = Component;