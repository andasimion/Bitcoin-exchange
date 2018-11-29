import React, { Component } from 'react';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate } from '../apiCalls';


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFiat: "USD",
      bitcoinAmount: null,
      fiatAmount: null,
      lastUpdated: null,
      lastUpdatedError: null,
      exchangeRates: {
        USD: null,
        RON: null,
        EUR: null,
        GBP: null,
      },
      exchangeRatesError: {
        USD: null,
        RON: null,
        EUR: null,
        GBP: null,
      }
    };
  
  this.setNewFiatCurrency = this.setNewFiatCurrency.bind(this);
  this.convertBitcoinToFiat  = this.convertBitcoinToFiat.bind(this);
  this.convertFiatToBitcoin  = this.convertFiatToBitcoin.bind(this);

  }

  componentDidMount() {
    
    getLastUpdatedBTCInUSDExchangeRate()
      .then(response => {
        this.setState({lastUpdated: response.data.time.updated,
                       lastUpdatedError: null});
      })
      .catch(error => {
        this.setState({lastUpdatedError: error.message,
                       lastUpdated: null});
      });
      
    for (let fiat in this.state.exchangeRates) {
      getLatestBTCInFiatExchangeRate (fiat)
        .then(response => {
          this.setState(
            prevState => {
              let exchangeRates = prevState.exchangeRates;
              let exchangeRatesError = prevState.exchangeRatesError;
              exchangeRates[fiat] = response.data.bpi[fiat].rate_float;
              exchangeRatesError[fiat] = null;
              return {exchangeRates} , {exchangeRatesError} 
            }
          )
        })
        .catch(error => {
          this.setState(
            prevState => {
              let exchangeRates = prevState.exchangeRates;
              let exchangeRatesError = prevState.exchangeRatesError;
              exchangeRates[fiat] = null;
              exchangeRatesError[fiat] = error.message;
              return {exchangeRates} , {exchangeRatesError} 
            }
          )
        })
    }  
  }

  setNewFiatCurrency = (value) => {
    this.setState({
                currentFiat: value,
                fiatAmount: this.state.bitcoinAmount ? String(this.state.bitcoinAmount * this.state.exchangeRates[value]) : null
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
          <Fiat fiatCurrency={this.state.currentFiat} 
                handleChange={this.setNewFiatCurrency}
          />
        </div>
        <br/>
        <div>
          <BitcoinInUSD value={this.state.exchangeRates.USD} 
                        valueError={this.state.exchangeRatesError.USD}
                        lastUpdated={this.state.lastUpdated}
                        lastUpdatedError={this.state.lastUpdatedError}
          />  
        </div>
        <br/>
        <div>
          <ExchangeCalculator fiatCurrency={this.state.currentFiat} 
              convertBitcoinToFiat ={this.convertBitcoinToFiat}
              convertFiatToBitcoin={this.convertFiatToBitcoin}
              bitcoinAmount={this.state.bitcoinAmount}
              fiatAmount={this.state.fiatAmount}
          />
        </div>
      </>
    );
  }
}


export default Calculator;

