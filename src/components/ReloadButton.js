import React from 'react';
import { Button } from 'antd'


const ReloadButton = (props) => {
    return (
        <Button type="primary" 
                shape="circle"
                icon="reload"
                onClick={props.refresh} />
    )
}

export default ReloadButton;