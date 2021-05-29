import React from 'react'

/**
* @author
* @function Rank
**/

const Rank = ({name , enteries}) => {
  return(
    <div>
        <div className = 'white f3'>
            {`${name}, your current entery count is...`}
        </div>
        <div className = 'white f1'>
            {enteries}
        </div>
    </div>
   )

 }

export default Rank