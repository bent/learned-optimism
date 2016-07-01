import React from 'react';
import ReactFireMixin from 'reactfire';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import AdversityPanel from './adversityPanel';

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
    const children = this.props.children;

    return(
      <AdversityPanel value={this.state && this.state.adversity}>
        {children && React.cloneElement(children, {
          beliefRef: this.firebaseRefs.belief,
          belief: this.state && this.state.belief
        })}
      </AdversityPanel>
    );
  }
});