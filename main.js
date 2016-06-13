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

var Adversities = props => (
  <div>
    <form>
      <input type='text' placeholder='Adversity'/>
    </form>
    <AdversityList value={props.value}/>
  </div>
);

ReactDOM.render(
  <Adversities value={adversities}/>,
  document.getElementById('example')
);