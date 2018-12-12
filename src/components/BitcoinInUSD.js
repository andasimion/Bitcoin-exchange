import React from 'react';
import PropTypes from 'prop-types';
import Alert from './Alert';
import Spinner from './Spinner';

const BitcoinInUSD = (props) => {
    console.log(props);
    return (
        <React.Fragment>
            <div>
                <span>
                    Current BTC price in USD: {' '}   
                        {
                        props.USDStatus.status === "inProgress" ? <Spinner size="small"/> :
                            props.USDStatus.status === "error" ? 
                                <Alert errorMessage={props.USDStatus.errorMessage}/> : props.USDValue
                        }
                </span>
            </div>
            <div>
                <span style={{fontSize: "small"}}>
                    Last updated: {' '}
                        {
                        props.lastUpdatedStatus.status === "inProgress" ? <Spinner size="small"/> :
                                    props.lastUpdatedStatus.status === "error" ?  
                                        <Alert errorMessage={props.lastUpdatedStatus.errorMessage} /> : props.lastUpdated
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