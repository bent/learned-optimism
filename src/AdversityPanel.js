import React from "react";

const Component = props => {
  return (
    <div>
      <h2>{props.value.description}</h2>
      {props.children}
    </div>
  );
};

Component.propTypes = {
  value: React.PropTypes.shape({
    description: React.PropTypes.string.isRequired
  }).isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.element
  ]).isRequired
};

export default Component;
