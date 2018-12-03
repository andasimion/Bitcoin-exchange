import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import ReloadButton from '../components/ReloadButton';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate } from '../apiCalls';


class Calculator extends Component {
  constructor(props) {
    console.log("constructor")
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
  this.fetchRateForFiat = this.fetchRateForFiat.bind(this);
  this.fetchOtherFiatRates = this.fetchOtherFiatRates.bind(this);
  this.fetchLastUpdatedUSDRate = this.fetchLastUpdatedUSDRate.bind(this);
  this.updateExchangeRateOnSuccess = this.updateExchangeRateOnSuccess.bind(this);
  this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
  this.refresh = this.refresh.bind(this);

  }

  componentDidMount() {
    console.log("componentDidMount");
    this.fetchRateForFiat("USD")
      .finally(() => Promise.all([
        this.fetchOtherFiatRates("USD"),
        this.fetchLastUpdatedUSDRate()
      ]))
  }


  fetchRateForFiat = (fiat) => getLatestBTCInFiatExchangeRate (fiat)
    .then(response => {
      this.updateExchangeRateOnSuccess(response, fiat);
    })
    .catch(error => {
      this.updateExchangeRateOnError(error, fiat);
    })

  fetchOtherFiatRates = (exceptFiat) => {
    let otherFiats = Object.keys(this.state.exchangeRates).filter((fiat) => fiat !== exceptFiat);
    let promises = otherFiats.map((fiat) => this.fetchRateForFiat(fiat))
    return Promise.all(promises);
  }

  fetchLastUpdatedUSDRate = () => {
    return getLastUpdatedBTCInUSDExchangeRate()
    .then(response => {
      this.setState({lastUpdated: response.data.time.updated,
                     lastUpdatedError: null});
    })
    .catch(error => {
      this.setState({lastUpdatedError: error.message,
                     lastUpdated: null});
    });
  }
    
  updateExchangeRateOnSuccess = (response, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesError = prevState.exchangeRatesError;
        
        exchangeRates[fiat] = response.data.bpi[fiat].rate_float;
        console.log("exchange rate for "+ fiat +" is now " + exchangeRates[fiat])
        exchangeRatesError[fiat] = null;
        return {exchangeRates, exchangeRatesError} 
      }
    )
  }

  updateExchangeRateOnError = (error, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesError = prevState.exchangeRatesError;
        exchangeRates[fiat] = null;
        exchangeRatesError[fiat] = error.message;
        return {exchangeRates, exchangeRatesError} 
      }
    )
  }
  
  refresh = (e) => {
    console.log("refresh")
    let currentFiat = this.state.currentFiat;
    this.fetchRateForFiat(currentFiat)
      .then(() => this.setState(prevState => {
          let newFiatAmount = this.bitcoinPriceInFiat(
              prevState.bitcoinAmount, 
              prevState.exchangeRates[prevState.currentFiat]);
          console.log("fiatAmount is now "+newFiatAmount );
          return {fiatAmount: String(newFiatAmount)};
        }))
      .finally(() => Promise.all([
        this.fetchOtherFiatRates(currentFiat),
        this.fetchLastUpdatedUSDRate()
      ]))
  }

  setNewFiatCurrency = (value) => {
    this.setState((prevState) => {
      let newFiatAmount = this.bitcoinPriceInFiat(prevState.bitcoinAmount, prevState.exchangeRates[value]);
      return {currentFiat: value, fiatAmount: String(newFiatAmount)};
    });
  }

  bitcoinPriceInFiat = (bitcoinAmount, exchangeRate) => {
     return bitcoinAmount ? bitcoinAmount * exchangeRate : null;
  }

  convertBitcoinToFiat = (e) => {
    let bitcoinAmount = e.target.value;
    let fiatAmount = null;
    if(isNaN(bitcoinAmount) || parseFloat(bitcoinAmount) < 0) {
      fiatAmount = "Error";
    } else {
      fiatAmount = String(this.bitcoinPriceInFiat(bitcoinAmount, this.state.exchangeRates[this.state.currentFiat]));
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

  /*validate = ([{type: "number", min: 0}], Number(this.state.bitcoinAmount), callback) => {
    callback()
  }*/

  render() {
    console.log("render")
    return (
      <>
        <Row>
          <Col span={8}>
            <Fiat fiatCurrency={this.state.currentFiat} 
                handleChange={this.setNewFiatCurrency}
            /> 
          </Col>
          <Col span={1} offset={15}>
            <ReloadButton refresh={this.refresh}/>
          </Col>
        </Row>
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
              validate={this.validate}
          />
        </div>
      </>
    );
  }
}


export default Calculator;

