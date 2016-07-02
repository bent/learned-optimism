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

    // Once we've got the belief, load the adversity that it belongs to, and all of its beliefs so
    // that we can set up links correctly
    beliefRef.once('value').then(snapshot => {
      const adversityId = snapshot.val().adversityId;
      this.bindAsObject(
        adversitiesRef.child(adversityId), 'adversity'
      );
      this.bindAsArray(
        beliefsRef.orderByChild('adversityId').equalTo(adversityId), 'beliefs'
      );
    });
  },
  render() {
    const children = this.props.children;

    return(
      <AdversityPanel value={this.state && this.state.adversity}>
        {children && React.cloneElement(children, {
          beliefRef: this.firebaseRefs.belief,
          belief: this.state && this.state.belief,
          beliefs: this.state && this.state.beliefs
        })}
      </AdversityPanel>
    );
  }
});