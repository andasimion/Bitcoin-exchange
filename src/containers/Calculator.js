import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import ReloadButton from '../components/ReloadButton';
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
      lastUpdatedSpin: true,
      USDSpin: true,
      bitcoinInputColor: "default",
      fiatInputColor: "default",
      exchangeRates: {
        USD: null,
        RON: null,
        EUR: null,
        GBP: null,
      },
      exchangeRatesState: {
        USD: {state: "inProgress"},
        RON: {state: "inProgress"},
        EUR: {state: "inProgress"},
        GBP: {state: "inProgress"},
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
    this.fetchRateForFiat("USD")
      .finally(() => Promise.all([
        this.fetchOtherFiatRates("USD"),
        this.fetchLastUpdatedUSDRate()
      ]))
  }

  fetchRateForFiat = (fiat) => getLatestBTCInFiatExchangeRate(fiat)
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
                     lastUpdatedError: null,
                     lastUpdatedSpin: false});
    })
    .catch(error => {
      this.setState({lastUpdatedError: error.message,
                     lastUpdated: null,
                     lastUpdatedSpin: false});
    });
  }
    
  updateExchangeRateOnSuccess = (response, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesState = prevState.exchangeRatesState;
        
        exchangeRates[fiat] = response.data.bpi[fiat].rate_float;
        exchangeRatesState[fiat] = {state: "success"};
        return {exchangeRates, exchangeRatesState} 
      }
    )
  }

  updateExchangeRateOnError = (error, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesState = prevState.exchangeRatesState;
        exchangeRates[fiat] = null;
        exchangeRatesState[fiat] = {state: "error",
                                    message: "error.message" } ;
        return {exchangeRates, exchangeRatesState} 
      }
    )
  }
  
  refresh = () => {
    let currentFiat = this.state.currentFiat;
    this.fetchRateForFiat(currentFiat)
      .then(() => this.setState(prevState => {
          let newFiatAmount = this.bitcoinPriceInFiat(
              prevState.bitcoinAmount, 
              prevState.exchangeRates[prevState.currentFiat]);
          return {fiatAmount: newFiatAmount};
        }))
      .finally(() => Promise.all([
        this.fetchOtherFiatRates(currentFiat),
        this.fetchLastUpdatedUSDRate()
      ]))
  }

  setNewFiatCurrency = (value) => {
    this.setState((prevState) => {
      let newFiatAmount = this.bitcoinPriceInFiat(prevState.bitcoinAmount, prevState.exchangeRates[value]);
      return {currentFiat: value, fiatAmount: newFiatAmount};
    });
  }

  bitcoinPriceInFiat = (bitcoinAmount, exchangeRate) => {
     return bitcoinAmount ? String(bitcoinAmount * exchangeRate) : null;
  }

  convertBitcoinToFiat = (e) => {
    let bitcoinAmount = e.target.value;
    let fiatAmount = null;
    if(isNaN(bitcoinAmount) || parseFloat(bitcoinAmount) < 0) {
      this.setState({bitcoinInputColor: "red"});
      return;
    } else {
      fiatAmount = this.bitcoinPriceInFiat(bitcoinAmount, this.state.exchangeRates[this.state.currentFiat]);
      this.setState(prevState => {
        let bitcoinInputColor = prevState.bitcoinInputColor;
        bitcoinInputColor = "default";
      })
      console.log(this.state.bitcoinInputColor)
    }
    this.setState({bitcoinAmount:bitcoinAmount, 
                   fiatAmount:fiatAmount,
                   bitcoinInputColor: "default"});
  }

  convertFiatToBitcoin = (e) => {
    let fiatAmount = e.target.value;
    let bitcoinAmount = null;
    if (isNaN(fiatAmount) || parseFloat(fiatAmount) < 0) {
      this.setState({fiatInputColor: "red"});
      return
    } else {
      bitcoinAmount = String(fiatAmount / this.state.exchangeRates[this.state.currentFiat]);
      this.setState(prevState => {
        let fiatInputColor = prevState.fiatInputColor;
        fiatInputColor = "default";
      })
    }
    this.setState({bitcoinAmount:bitcoinAmount, 
                   fiatAmount:fiatAmount,
                   fiatInputColor: "default"});
  }



  render() {
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
                        valueState={this.state.exchangeRatesState.USD}
                        lastUpdated={this.state.lastUpdated}
                        lastUpdatedError={this.state.lastUpdatedError}
                        lastUpdatedSpin={this.state.lastUpdatedSpin}
          />  
        </div>
        <br/>
        <div>
          <ExchangeCalculator fiatCurrency={this.state.currentFiat} 
              convertBitcoinToFiat ={this.convertBitcoinToFiat}
              convertFiatToBitcoin={this.convertFiatToBitcoin}
              bitcoinAmount={this.state.bitcoinAmount}
              fiatAmount={this.state.fiatAmount}
              bitcoinInputColor={this.state.bitcoinInputColor}
              fiatInputColor={this.state.fiatInputColor}
          />
        </div>
      </>
    );
  }
}

export default Calculator;

