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
  this.makeApiCalls = this.makeApiCalls.bind(this);
  this.updateExchangeRateOnSuccess = this.updateExchangeRateOnSuccess.bind(this);
  this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
  this.refresh = this.refresh.bind(this);

  }

  componentDidMount() {
    console.log("componentDidMount");
    this.makeApiCalls();
  }


  makeApiCalls = () => {
    getLastUpdatedBTCInUSDExchangeRate()
    .then(response => {
      this.setState({lastUpdated: response.data.time.updated,
                     lastUpdatedError: null});
    })
    .catch(error => {
      this.setState({lastUpdatedError: error.message,
                     lastUpdated: null});
    });
  
    getLatestBTCInFiatExchangeRate ("USD")
      .then(response => {
        this.updateExchangeRateOnSuccess(response, "USD");
      })
      .catch(error => {
        this.updateExchangeRateOnError(error, "USD");
      })
       
    for (let fiat of Object.keys(this.state.exchangeRates).slice(1)) {
      getLatestBTCInFiatExchangeRate (fiat)
        .then(response => {
          this.updateExchangeRateOnSuccess(response, fiat);
        })
        .catch(error => {
          this.updateExchangeRateOnError(error, fiat);
        })
      } 
  }

  updateExchangeRateOnSuccess = (response, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesError = prevState.exchangeRatesError;
        exchangeRates[fiat] = response.data.bpi[fiat].rate_float;
        exchangeRatesError[fiat] = null;
       // return {exchangeRates} , {exchangeRatesError} 
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
      //  return {exchangeRates} , {exchangeRatesError} 
      }
    )
  }
  
  refresh = (e) => {
    console.log("refresh")
    this.makeApiCalls();
    this.setState({fiatAmount: String(this.state.bitcoinAmount * this.state.exchangeRates[this.state.currentFiat]) })
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

