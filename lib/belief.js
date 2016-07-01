import React from 'react';
import ReactFireMixin from 'reactfire';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import AdversityPanel from './adversityPanel';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {};
  },
  componentWillMount() {
    this.state.beliefRef = 
      beliefsRef.child(this.props.params.beliefId);
    this.bindAsObject(this.state.beliefRef, 'belief');

    // Once we've got the belief, load the adversity that it belongs to
    this.state.beliefRef.once('value').then(snapshot => {
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
          beliefRef: this.state.beliefRef,
          belief: this.state.belief
        })}
      </AdversityPanel>
    );
  }
});