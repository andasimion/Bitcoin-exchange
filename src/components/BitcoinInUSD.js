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
                            props.USDStatus.status === "inProgress" ? <Spinner size="small"/> :
                                props.USDStatus.status === "error" ? 
                                    <Alert 
                                        message="Error"
                                        description={props.USDStatus.errorMessage}
                                        type="error"
                                        showIcon /> : props.USDValue
                            }
                        </span> 
                </span>
            </div>
            <div>
                <span style={{fontSize: "small"}}>
                    <span>Last updated: </span>
                        <span>
                        {
                        props.lastUpdatedStatus.status === "inProgress" ? <Spinner size="small"/> :
                                    props.lastUpdatedStatus.status === "error" ?  
                                        <Alert 
                                        message="Error"
                                        description={props.lastUpdatedStatus.errorMessage}
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