var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var React = require('react');
var ReactDOM = require('react-dom');

var Adversities = React.createClass({
  getInitialState: function() {
    return {
      data: [
        {id: 1, description: 'cat died'}, 
        {id: 2, description: "didn't get that promotion"}
      ], 
      description: ''
    };
  },
  render: function() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type='text' 
                 placeholder='Adversity' 
                 value={this.state.description}
                 onChange={this.handleChange}/>
          <input type="submit" value="Go" />
        </form>
        <ul>
          {this.state.data.map(adversity => (
            <li key={adversity.id}>{adversity.description}</li>
          ))}
        </ul>
      </div>
    );
  },
  handleChange: function(e) {
    e.preventDefault();
    this.setState({description: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({
      data: this.state.data.concat({id: Date.now(), description: this.state.description}),
      description: ''
    });
  }
}); 

ReactDOM.render(
  <Adversities/>,
  document.getElementById('example')
);