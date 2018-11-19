import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import getLatestBTCExchangeRate from '../apiCalls';


class HistoricalData extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      bitcoinInUSD: null,
      lastUpdated: null,
    };
    getLatestBTCExchangeRate((latestBTCExchangeRate) => this.setState(latestBTCExchangeRate));
  }
  
  render() {
    return (
      <> 
        <div>
          <BitcoinInUSD value={this.state.bitcoinInUSD} lastUpdated={this.state.lastUpdated}/>  
        </div>
        <br/>
        <div>
          <DateSelector />
        </div>
      </>
    )
  }
}

export default HistoricalData;