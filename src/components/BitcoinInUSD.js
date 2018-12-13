import React from 'react';
import PropTypes from 'prop-types';
import AlertError from './AlertError';
import Spinner from './Spinner';

const BitcoinInUSD = (props) => {
    console.log(props);
    let spinner = <Spinner size="small"/>;
    let USDRateAlertError = <AlertError errorMessage={props.USDStatus.errorMessage}/>;
    let lastUpdatedAlertError = <AlertError errorMessage={props.lastUpdatedStatus.errorMessage} />
    return (
        <React.Fragment>
            <div>
                <span>
                    Current BTC price in USD: {' '}   
                        {
                        props.USDStatus.status === "inProgress" ? 
                            spinner :
                                props.USDStatus.status === "error" ? 
                                    USDRateAlertError : 
                                        props.USDValue
                        }
                </span>
            </div>
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