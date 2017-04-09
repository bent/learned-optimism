import React from "react";

const Component = props => (
  <span
    onClick={e => {
      e.preventDefault();
      props.remove();
    }}
    className="remove glyphicon glyphicon-remove"
  />
);

Component.propTypes = {
  // Callback to be invoked if removal is to occur
  remove: React.PropTypes.func.isRequired
};

export default Component;
