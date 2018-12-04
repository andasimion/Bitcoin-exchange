import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

const BitcoinInUSD = (props) => {
    return (
        <React.Fragment>
            <div>
                <span>
                    Current BTC price in USD: 
                        {
                        props.value || 
                        <Alert 
                            message="Error"
                            description={props.valueError}
                            type="error"
                            showIcon />
                        }
                </span>
            </div>
            <div>
                <span style={{fontSize: "small"}}>
                    Last updated: 
                        {
                        props.lastUpdated || 
                        <Alert 
                            message="Error"
                            description={props.lastUpdatedError}
                            type="error"
                            showIcon />
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