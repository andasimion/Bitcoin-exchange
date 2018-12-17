import React from 'react';
import AlertError from './AlertError';
import Spinner from './Spinner';

const BitcoinInUSD = (props) => {
    let spinner = <Spinner size="small"/>;
    let USDRateAlertError = <AlertError errorMessage={props.USDStatus.errorMessage}/>;
    return (
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
    )
}

export default BitcoinInUSD;