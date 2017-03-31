import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const Component = ({ value }) =>
  value &&
  <div className="list-group">
    <ReactCSSTransitionGroup
      transitionName="list-group-item"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {value.map(item => {
        return (
          <div className="list-group-item" key={item[".key"]}>
            {item.description}
          </div>
        );
      })}
    </ReactCSSTransitionGroup>
  </div>;

Component.propTypes = {
  value: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  ).isRequired
};

export default Component;
