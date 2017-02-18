import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Spinner from 'react-spinner';
import { BrowserRouter, Link, Switch } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Adversities from './Adversities';
import Adversity from './Adversity';
import Belief from './Belief';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import firebase from './firebase';

import logo from './logo.svg';

const auth = firebase.auth();

const App = ({user, ...rest}) => (
  <BrowserRouter>
    <div>
      <Navbar expanded={rest.navbarExpanded} onToggle={rest.toggle}>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/"><img src={logo} role="presentation"/><span>Learned Optimism</span></Link>
          </Navbar.Brand>
          {user && <Navbar.Toggle/>}
        </Navbar.Header>
        {user && <Navbar.Collapse>
          <Nav pullRight>
            <NavItem onClick={rest.logout}>Logout</NavItem>
          </Nav>
        </Navbar.Collapse>}
      </Navbar>

      { 
      // If we know for sure whether we are logged-in or not, try to match the route. Otherwise 
      // just show a spinner.
      user !== undefined ? 
        <div className='container'>
          <Switch>
            <PublicRoute path="/login" component={Login} user={user}/>
            <PublicRoute path="/register" component={Register} user={user}/>

            <PrivateRoute path="/adversities/:adversityId" component={Adversity} user={user}/>
            <PrivateRoute path="/beliefs/:beliefId" component={Belief} user={user}/>
            <PrivateRoute path="/" exactly component={Adversities} user={user} />
          </Switch>
        </div>
        :
        <Spinner/>
      }
    </div>
  </BrowserRouter>
)

export default React.createClass({
  getInitialState() {
    return {
      user: undefined, // `undefined` signifies that we don't know yet if we are logged in or not
      navbarExpanded: false
    };
  },
  componentWillMount() {
    this.unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => this.setState({user}));
  },
  componentWillUnmount() {
    this.unsubscribeAuthStateChanged();
  },
  render() {
    return <App {...{...this.state, toggle: this.toggle, logout: this.logout}}/>;
  },
  toggle() {
    this.setState(state => ({navbarExpanded: !state.navbarExpanded}));
  },
  logout() {
    auth.signOut().then(() => {
      this.setState({navbarExpanded: false});
    }).catch(error => {
      console.log(error);
    });
  }
});