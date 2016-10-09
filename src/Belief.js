import React from 'react';
import ReactFireMixin from 'reactfire';
import Spinner from 'react-spinner';
import firebase from 'firebase';

import AdversityPanel from './AdversityPanel';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    children: React.PropTypes.element.isRequired,
    userRef: React.PropTypes.instanceOf(firebase.database.Reference),
    beliefId: React.PropTypes.string
  },
  componentWillMount() {
    this._loadData(this.props.userRef, this.props.params.beliefId);
  },
  componentWillReceiveProps(nextProps) {
    const nextUserRef = nextProps.userRef;
    const nextBeliefId = nextProps.params.beliefId;

    if (nextUserRef !== this.props.userRef ||
        nextBeliefId !== this.props.params.beliefId) {
        if (this.firebaseRefs.belief) this.unbind('belief');
        if (this.firebaseRefs.adversity) this.unbind('adversity');
        this._loadData(nextUserRef, nextBeliefId);
    }
  },
  render() {
    return(this.state && this.state.belief && this.state.beliefs ?
      <AdversityPanel value={this.state.adversity}>
        {React.cloneElement(this.props.children, {
          beliefRef: this.firebaseRefs.belief,
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
      this.bindAsObject(beliefRef, 'belief');

      // Once we've got the belief, load the adversity that it belongs to, and all of its beliefs so
      // that we can set up links correctly
      beliefRef.once('value').then(snapshot => {
        const adversityId = snapshot.val().adversityId;
        this.bindAsObject(
          userRef.child('adversities').child(adversityId), 'adversity'
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
  }
});