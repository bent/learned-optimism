import React from 'react';

module.exports = props => {
  const list = props.value;

  return (
    list && 
      <div className="list-group">
        {list.map(item => {
          return (
            <div className="list-group-item" key={item['.key']}>
              {item.description}
            </div>
          );
        })}
      </div>
  );
}