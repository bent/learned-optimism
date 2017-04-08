import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Spinner from "react-spinner";

const Component = ({ value }) =>
  value
    ? <div className="list-group">
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
      </div>
    : <Spinner />;

Component.propTypes = {
  value: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  )
};

export default Component;
