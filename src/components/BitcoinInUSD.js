import React from 'react';

const BitcoinInUSD = (props) => {
    return (
        <React.Fragment>
            <span>Current BTC price in USD: {props.value}</span>
            <div style={{fontSize: "small"}}>Last updated: {props.lastUpdated}</div>
        </React.Fragment>
    );
}    

export default BitcoinInUSD;