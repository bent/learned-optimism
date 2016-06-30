import React from 'react';
import ReactFireMixin from 'reactfire';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount() {
    const beliefRef = 
      beliefsRef.child(this.props.params.beliefId);

    this.bindAsObject(beliefRef, 'belief');

    // Once we've got the belief, load the adversity that it belongs to
    beliefRef.once('value').then(snapshot => {
      this.bindAsObject(
        adversitiesRef.child(snapshot.val().adversityId), 'adversity'
      );
    });
  },
  render() {
    const adversity = this.state && this.state.adversity;

    return(adversity ?
      <div>
        <h2>{adversity.description}</h2>
        {this.props.children}
      </div>
      :
      <div/>
    );
  }
});