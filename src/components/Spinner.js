import React from 'react';
import { Spin } from 'antd';


const Spinner = (props) => {
    
    return(
        <Spin  size={props.size} style={props.style}/>
    )
}

export default Spinner;