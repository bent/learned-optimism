import React from 'react';
import ReactFireMixin from 'reactfire';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount() {
    this.beliefRef = 
      beliefsRef.child(this.props.params.beliefId);

    // Once we've got the belief, load the adversity that it belongs to
    this.beliefRef.once('value').then(snapshot => {
      this.bindAsObject(
        adversitiesRef.child(snapshot.val().adversityId), 'adversity'
      );
    });
  },
  render() {
    const children = this.props.children;
    const adversity = this.state && this.state.adversity;

    return(adversity ?
      <div>
        <h2>{adversity.description}</h2>
        {children && React.cloneElement(children, {
          beliefRef: this.beliefRef
        })}
      </div>
      :
      <div/>
    );
  }
});