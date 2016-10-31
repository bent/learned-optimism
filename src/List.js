import React from 'react';

const Component = props => {
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

Component.propTypes = {
  value: React.PropTypes.arrayOf(React.PropTypes.shape({
    description: React.PropTypes.string.isRequired
  })).isRequired,
};

export default Component;