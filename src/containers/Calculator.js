import React, { Component } from 'react';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate } from '../apiCalls';

import PropTypes from 'prop-types';


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFiat: "USD",
      bitcoinAmount: null,
      fiatAmount: null,
      lastUpdated: null,
        exchangeRates: {
            USD: null,
            RON: null,
            EUR: null,
            GBP: null
        }
    };

  this.setNewFiatCurrency = this.setNewFiatCurrency.bind(this);
  this.convertBitcoinToFiat  = this.convertBitcoinToFiat.bind(this);
  this.convertFiatToBitcoin  = this.convertFiatToBitcoin.bind(this);

  getLastUpdatedBTCInUSDExchangeRate((lastUpdated) => {this.setState({lastUpdated})} );
      
  for (let fiat in this.state.exchangeRates) {
    getLatestBTCInFiatExchangeRate (fiat, fiatValue => this.setState(prevState => {let exchangeRates = prevState.exchangeRates;
                                                                      exchangeRates[fiat] = fiatValue;
                                                                      return {exchangeRates}  
          }
        )
      );
    } 
  }


  setNewFiatCurrency = (value) => {
    this.setState({
                currentFiat: value,
                bitcoinAmount:null,
                fiatAmount: null
                  })
  }

  convertBitcoinToFiat = (e) => {
    let bitcoinAmount = e.target.value;
    let fiatAmount = null;
    if(isNaN(bitcoinAmount) || parseFloat(bitcoinAmount) < 0) {
      fiatAmount = "Error";
    } else {
      fiatAmount = String(bitcoinAmount * this.state.exchangeRates[this.state.currentFiat]);
    }
    this.setState({bitcoinAmount, fiatAmount});
  }

  convertFiatToBitcoin = (e) => {
    let fiatAmount = e.target.value;
    let bitcoinAmount = null;
    if (isNaN(fiatAmount) || parseFloat(fiatAmount) < 0) {
      bitcoinAmount = "Error";
    } else {
      bitcoinAmount = String(fiatAmount / this.state.exchangeRates[this.state.currentFiat]);
    }
    this.setState({bitcoinAmount, fiatAmount});
  }

  render() {
    return (
      <>
        <div>
          <Fiat fiatCurrency={this.state.currentFiat} handleChange={this.setNewFiatCurrency}/>
        </div>
        <br/>
        <div>
          <BitcoinInUSD value={this.state.exchangeRates.USD} lastUpdated={this.state.lastUpdated}/>  
        </div>
        <br/>
        <div>
          <ExchangeCalculator fiatCurrency={this.state.currentFiat} 
              convertBitcoinToFiat ={this.convertBitcoinToFiat }
              convertFiatToBitcoin={this.convertFiatToBitcoin}
              bitcoinAmount={this.state.bitcoinAmount}
              fiatAmount={this.state.fiatAmount}/>
        </div>
      </>
    );
  }
}


Calculator.propTypes = {
  lastUpdated: PropTypes.string,
  exchangeRates: PropTypes.objectOf(PropTypes.number)
}

export default Calculator;