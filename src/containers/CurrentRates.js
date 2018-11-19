import React, { Component } from 'react';
import HistoricalData from './HistoricalData';
import Calculator from './Calculator';
import getLatestBTCExchangeRate from '../apiCalls';


class CurrentRates extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        bitcoinInUSD: null,
        lastUpdated: null,
        targetCurrency: "USD",
        exchangeRate: null,
      };
      getLatestBTCExchangeRate((latestBTCExchangeRate) => this.setState(latestBTCExchangeRate));
    }

    render() {
        return (
            <>
                {this.props.children}
            </>    
        )
    }
}    

export default CurrentRates;