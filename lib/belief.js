import React from 'react';
import ReactFireMixin from 'reactfire';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import AdversityPanel from './adversityPanel';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount() {
    this.beliefRef = 
      beliefsRef.child(this.props.params.beliefId);
    this.bindAsObject(this.beliefRef, 'belief');

    // Once we've got the belief, load the adversity that it belongs to
    this.beliefRef.once('value').then(snapshot => {
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
          beliefRef: this.beliefRef,
          belief: this.state.belief
        })}
      </AdversityPanel>
    );
  }
});