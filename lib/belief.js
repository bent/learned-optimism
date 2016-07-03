import React from 'react';
import ReactFireMixin from 'reactfire';

import adversitiesRef from './adversitiesRef';
import beliefsRef from './beliefsRef';
import AdversityPanel from './adversityPanel';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount() {
    this._loadData(this.props.params.beliefId);
  },
  componentWillReceiveProps(nextProps) {
    const nextBeliefId = nextProps.params.beliefId;

    if (this.props.params.beliefId != nextBeliefId) {
      this.unbind('belief');
      this.unbind('adversity');
      this._loadData(nextBeliefId);
    }
  },
  render() {
    const children = this.props.children;

    return(this.state && this.state.belief && this.state.beliefs ?
      <AdversityPanel value={this.state.adversity}>
        {children && React.cloneElement(children, {
          beliefRef: this.firebaseRefs.belief,
          belief:  this.state.belief,
          beliefs: this.state.beliefs
        })}
      </AdversityPanel>
      :
      <div/>
    );
  },
  _loadData(beliefId) {
    const beliefRef = beliefsRef.child(beliefId);
    this.bindAsObject(beliefRef, 'belief');

    // Once we've got the belief, load the adversity that it belongs to, and all of its beliefs so
    // that we can set up links correctly
    beliefRef.once('value').then(snapshot => {
      const adversityId = snapshot.val().adversityId;
      this.bindAsObject(
        adversitiesRef.child(adversityId), 'adversity'
      );
      beliefsRef.orderByChild('adversityId').equalTo(adversityId).once('value').then(snapshot => {
        let beliefs = [];

        snapshot.forEach(data => {
          beliefs = beliefs.concat(Object.assign({'.key': data.key}, data.val()));
        });

        this.setState({beliefs});
      });
    });
  }
});