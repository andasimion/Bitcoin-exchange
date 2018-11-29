import React from 'react';
import PropTypes from 'prop-types';

const BitcoinInUSD = (props) => {
    return (
        <React.Fragment>
            <span>Current BTC price in USD: {props.value || props.valueError}</span>
            <div style={{fontSize: "small"}}>Last updated: {props.lastUpdated || props.lastUpdatedError}</div>
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