import React, { Component } from 'react';
import AlertError from './AlertError';
import Spinner from './Spinner';

const LastUpdatedUSDRate = (props) => {
    
    let spinner = <Spinner size="small"/>;
    let lastUpdatedAlertError = <AlertError errorMessage={props.lastUpdatedStatus.errorMessage} />
    
    return (
        <div>
            <span style={{fontSize: "small"}}>
                Last updated: {' '}
                    {
                    props.lastUpdatedStatus.status === "inProgress" ? 
                        spinner :
                            props.lastUpdatedStatus.status === "error" ?  
                                lastUpdatedAlertError : 
                                    props.lastUpdated
                    }
            </span>
        </div>
    )
}

export default LastUpdatedUSDRate;