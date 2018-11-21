import React from 'react';
import PropTypes from 'prop-types';

const BitcoinInUSD = (props) => {
    return (
        <React.Fragment>
            <span>Current BTC price in USD: {props.value}</span>
            <div style={{fontSize: "small"}}>Last updated: {props.lastUpdated}</div>
        </React.Fragment>
    );
}    

BitcoinInUSD.propTypes = {
    value: PropTypes.number,
    lastUpdated: PropTypes.string
}

export default BitcoinInUSD;