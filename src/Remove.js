import React from "react";
import { Button } from "react-bootstrap";

const Component = React.createClass({
  getInitialState() {
    return { showConfirmation: false };
  },
  render() {
    return !this.state.showConfirmation
      ? <span
          className="remove glyphicon glyphicon-remove"
          onClick={this._showConfirmation}
        />
      : <Button bsStyle="danger" onClick={this._delete}>
          Delete
        </Button>;
  },
  _showConfirmation(e) {
    e.preventDefault();
    this.setState({ showConfirmation: true });
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
