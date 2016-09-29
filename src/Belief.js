import React from 'react';
import Spinner from 'react-spinner';

import AdversityPanel from './AdversityPanel';
import arrayFrom from './arrayFrom';

module.exports = React.createClass({
  componentWillMount() {
    this._loadData(this.props.userRef, this.props.params.beliefId);
  },
  componentWillReceiveProps(nextProps) {
    const nextUserRef = nextProps.userRef;
    const nextBeliefId = nextProps.params.beliefId;

    if (nextUserRef !== this.props.userRef ||
        nextBeliefId !== this.props.params.beliefId) {
        this._loadData(nextUserRef, nextBeliefId);
    }
  },
  render() {
    const children = this.props.children;

    return(this.state && this.state.adversity && this.state.belief && this.state.beliefs ?
      <AdversityPanel value={this.state.adversity}>
        {children && React.cloneElement(children, {
          beliefRef: this.props.userRef.child('beliefs').child(this.props.params.beliefId),
          belief:  this.state.belief,
          beliefs: this.state.beliefs
        })}
      </AdversityPanel>
      :
      <Spinner/>
    );
  },
  _loadData(userRef, beliefId) {
    if (userRef && beliefId) {
      const beliefsRef = userRef.child('beliefs');
      const beliefRef = beliefsRef.child(beliefId);

      // Once we've got the belief, load the adversity that it belongs to, and all of its beliefs so
      // that we can set up links correctly
      beliefRef.once('value').then(snapshot => {
        const belief = Object.assign({'.key': snapshot.key}, snapshot.val());
        const adversityId = belief.adversityId;

        Promise.all([
          userRef.child('adversities').child(adversityId).once('value'),
          beliefsRef.orderByChild('adversityId').equalTo(adversityId).once('value')
        ]).then(results => {
          this.setState({belief, adversity: results[0].val(), beliefs: arrayFrom(results[1])});
        });
      });
    }
  }
});