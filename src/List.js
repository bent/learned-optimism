import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Spinner from "react-spinner";

const Component = ({ value, ...props }) =>
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
                <span
                  onClick={e => {
                    e.preventDefault();
                    props.remove(item[".key"]);
                  }}
                  className="remove glyphicon glyphicon-remove"
                />
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
  ),
  remove: React.PropTypes.func.isRequired
};

export default Component;
