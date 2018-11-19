import React, { Component } from 'react';
import HistoricalData from './HistoricalData';
import Calculator from './Calculator';
import getLatestBTCExchangeRate from '../apiCalls';


class CurrentRates extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        lastUpdated: null,
        exchangeRates: {
            USD: null,
            RON: null,
            EUR: null,
            BGP: null
        }
      };
      getLatestBTCExchangeRate((latestBTCExchangeRate) => 
      this.setState(prevState => {lastUpdated: null, exchangeRates: prevState.exchangeRates});
    }

    render() {
        return (
            <>
                <Calculator exchangeRates={this.state.exchangeRates} lastUpdated={this.state.lastUpdated}/>
            </>    
        )
    }
}    

export default CurrentRates;