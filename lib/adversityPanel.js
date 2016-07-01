import React from 'react';

module.exports = props => {
  const adversity = props.value;

  return(adversity ?
    <div>
      <h2>{adversity.description}</h2>
      {props.children}
    </div>
    :
    <div/>
  );
};