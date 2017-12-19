import React from "react";

export default {
  belief: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired
  }).isRequired
};
