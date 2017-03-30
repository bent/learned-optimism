import React from "react";

const Component = ({ value }) =>
  value &&
  <div className="list-group">
    {value.map(item => {
      return (
        <div className="list-group-item" key={item[".key"]}>
          {item.description}
        </div>
      );
    })}
  </div>;

Component.propTypes = {
  value: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  ).isRequired
};

export default Component;
