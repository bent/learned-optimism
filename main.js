var React = require('react');
var ReactDOM = require('react-dom');

var adversities = [
	{description: 'cat died'}, 
	{description: "didn't get that promotion"}
];

var Adversities = (props) => {
	return <ul>
		{props.value.map(adversity => {
			return <li>{adversity.description}</li>;
		})}
	</ul>;
};

ReactDOM.render(
  <Adversities value={adversities}/>,
  document.getElementById('example')
);