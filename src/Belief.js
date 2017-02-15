import React from 'react';
import ReactFireMixin from 'reactfire';
import Spinner from 'react-spinner';
import firebase from 'firebase';

import { Route } from 'react-router-dom';

import Evidence from './Evidence';
import Alternatives from './Alternatives';
import Implications from './Implications';
import AdversityPanel from './AdversityPanel';
import userRefFor from './userRef';

export default React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    match: React.PropTypes.shape({    
      params: React.PropTypes.shape({
        beliefId: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    user: React.PropTypes.instanceOf(firebase.User).isRequired
  },
  componentWillMount() {
    this._loadData(this.props.match.params.beliefId);
  },
  componentWillReceiveProps(nextProps) {
    const { beliefId } = nextProps.match.params;

    if (beliefId !== this.props.match.params.beliefId) {
        if (this.firebaseRefs.belief) this.unbind('belief');
        if (this.firebaseRefs.adversity) this.unbind('adversity');
        this._loadData(beliefId);
    }
  },
  render() {
    if (this.state && this.state.belief && this.state.beliefs) {
      const { path } = this.props.match;
      const disputationProps = { 
        beliefRef:  this.firebaseRefs.belief, 
        belief: this.state.belief, 
        beliefs: this.state.beliefs
      }

      return (
        <AdversityPanel value={this.state.adversity}>
          <Route path={`${path}/evidence`} render={() => <Evidence {...disputationProps}/>}/>
          <Route path={`${path}/alternatives`} render={() =>  <Alternatives {...disputationProps}/>}/>
          <Route path={`${path}/implications`} render={() => <Implications {...disputationProps}/>}/>
        </AdversityPanel>
      )
    } else {
      return <Spinner/>
    }
  },
  _loadData(beliefId) {
    const userRef = userRefFor(this.props.user);
    const beliefsRef = userRef.child('beliefs');
    const beliefRef = beliefsRef.child(beliefId);
    this.bindAsObject(beliefRef, 'belief');

    // Once we've got the belief, load the adversity that it belongs to, and all of its beliefs so
    // that we can set up links correctly
    beliefRef.once('value').then(snapshot => {
      const adversityId = snapshot.val().adversityId;
      this.bindAsObject(userRef.child('adversities').child(adversityId), 'adversity');
      
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