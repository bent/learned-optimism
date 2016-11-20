import React from 'react';
import { Match } from 'react-router';

import Adversities from './Adversities';
import Adversity from './Adversity';

export default props => (
  <div>
    <Match 
      exactly
      pattern="/adversities" 
      render={() => <Adversities userRef={props.userRef}/>}
    />
    <Match 
      pattern="/adversities/:adversityId" 
      render={adversityProps => {
        return (
          <Adversity userRef={props.userRef} adversityId={adversityProps.params.adversityId}/>
        )
      }}
    />
  </div>
)
 
