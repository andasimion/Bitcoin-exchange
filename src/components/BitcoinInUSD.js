import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import Spinner from './Spinner';

const BitcoinInUSD = (props) => {
    return (
        <React.Fragment>
            <div>
                <span>
                    <span>Current BTC price in USD: </span> 
                        <span>   
                            {
                            props.valueState.state === "inProgress" ? <Spinner /> :
                                props.valueState.state === "error" ? 
                                    <Alert 
                                        message="Error"
                                        description={props.valueState.message}
                                        type="error"
                                        showIcon /> : props.value
                            }
                        </span> 
                </span>
            </div>
            <div>
                <span style={{fontSize: "small"}}>
                    <span>Last updated: </span>
                        <span>
                        {
                        props.lastUpdatedSpin ? <Spinner /> :
                                    props.lastUpdatedError ?  
                                        <Alert 
                                        message="Error"
                                        description={props.lastUpdatedError}
                                        type="error"
                                        showIcon /> : props.lastUpdated
                        }
                        </span>
                </span>
            </div>
        </React.Fragment>
    );
}    

BitcoinInUSD.propTypes = {
    value: PropTypes.number,
    valueError: PropTypes.string,
    lastUpdated: PropTypes.string,
    lastUpdatedError: PropTypes.string,
}

export default BitcoinInUSD;