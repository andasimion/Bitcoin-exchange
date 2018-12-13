import React from 'react';
import { Alert } from 'antd';

const AlertError = (props) => {
    return (
        <Alert 
            message="Error"
            description={props.errorMessage}
            type="error"
            showIcon />
    )
}

export default AlertError;