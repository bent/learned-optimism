var React = require('react');
var ReactDOM = require('react-dom');

var adversities = [
  {id: 1, description: 'cat died'}, 
  {id: 2, description: "didn't get that promotion"}
];

var AdversityList = props => (
  <ul>
    {props.value.map(adversity => (
      <li key={adversity.id}>{adversity.description}</li>
    ))}
  </ul>
);

var Adversities = React.createClass({
  render: function() {
    return (
      <div>
        <form>
          <input type='text' placeholder='Adversity'/>
          <input type="submit" value="Go" />
        </form>
        <AdversityList value={this.props.value}/>
      </div>
    );
  }
}); 

ReactDOM.render(
  <Adversities value={adversities}/>,
  document.getElementById('example')
);