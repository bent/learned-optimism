import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Spinner from "react-spinner";

import Remove from "./Remove";

const Component = ({ value, ...props }) =>
  value
    ? <div className="list-group">
        <ReactCSSTransitionGroup
          transitionName="list-group-item"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {value.map(item => {
            const { id } = item;
            return (
              <div className="list-group-item" key={id}>
                {item.description}
                <Remove remove={() => props.remove(id)} />
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
  // Callback to be invoked if an item with a particular ID is to be remove from
  // the list
  remove: React.PropTypes.func.isRequired
};

export default Component;
