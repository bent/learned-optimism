import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const Component = React.createClass({
  getInitialState() {
    return { showConfirmation: false };
  },
  render() {
    return (
      <span>
        <span
          className="remove glyphicon glyphicon-remove"
          onClick={this._showConfirmation}
        />

        <ReactCSSTransitionGroup
          transitionName="confirmation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.state.showConfirmation &&
            <ButtonGroup key="confirmation">
              <Button bsStyle="danger" onClick={this._delete}>
                Delete
              </Button>
              <Button onClick={this._cancel}>
                Cancel
              </Button>
            </ButtonGroup>}
        </ReactCSSTransitionGroup>
      </span>
    );
  },
  _showConfirmation(e) {
    e.preventDefault();
    this.setState({ showConfirmation: true });
  },
  _cancel(e) {
    e.preventDefault();
    this.setState({ showConfirmation: false });
  },
  _delete(e) {
    e.preventDefault();
    this.props.remove();
  }
});

Component.propTypes = {
  // Callback to be invoked if removal is to occur
  remove: React.PropTypes.func.isRequired
};

export default Component;
