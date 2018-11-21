import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HistoricalData from './HistoricalData';
import Calculator from './Calculator';
import Error404 from './Error404';
import { getLatestBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate } from '../apiCalls';


class CurrentRates extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        lastUpdated: null,
        exchangeRates: {
            USD: null,
            RON: null,
            EUR: null,
            GBP: null
        }
      };

      getLatestBTCInUSDExchangeRate (lastUpdated => this.setState({lastUpdated}));
      
      for (let fiat in this.state.exchangeRates) {
        getLatestBTCInFiatExchangeRate (fiat, fiatValue => this.setState(prevState => {let exchangeRates = prevState.exchangeRates;
                                                                          exchangeRates[fiat] = fiatValue;
                                                                          return {exchangeRates}  
            }
          )
        );
      } 
    }

    render() {
        return (
            <>
            <Switch>
                <Route path="/" render={(props) => <Calculator {...props} exchangeRates={this.state.exchangeRates} lastUpdated={this.state.lastUpdated} />} exact/>
                <Route path="/historicalData" render={(props) => <HistoricalData {...props} lastUpdated={this.state.lastUpdated} value={this.state.exchangeRates["USD"]} />} /> 
                <Route component={Error404} />
            </Switch>
            </>    
        )
    }
}    

export default CurrentRates;