import React from 'react';
import ReactFireMixin from 'reactfire';
import Spinner from 'react-spinner';
import firebase from 'firebase';

import { Match } from 'react-router';

import Evidence from './Evidence';
import Alternatives from './Alternatives';
import Implications from './Implications';

import AdversityPanel from './AdversityPanel';

module.exports = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    params: React.PropTypes.shape({
      beliefId: React.PropTypes.string
    }).isRequired,
    userRef: React.PropTypes.instanceOf(firebase.database.Reference)
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
    const { pathname } = this.props;

    return(this.state && this.state.belief && this.state.beliefs ?
      <AdversityPanel value={this.state.adversity}>
        <Match pattern={`${pathname}/evidence`} render={() => 
          <Evidence 
            beliefRef={this.firebaseRefs.belief} 
            belief={this.state.belief} 
            beliefs={this.state.beliefs}
          />
        }/>
        <Match pattern={`${pathname}/alternatives`} render={() => 
          <Alternatives
            beliefRef={this.firebaseRefs.belief} 
            belief={this.state.belief} 
            beliefs={this.state.beliefs}
          />
        }/>
        <Match pattern={`${pathname}/implications`} render={() => 
          <Implications
            beliefRef={this.firebaseRefs.belief} 
            belief={this.state.belief} 
            beliefs={this.state.beliefs}
          />
        }/>
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