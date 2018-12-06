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
      lastUpdatedStatus: {status: "inProgress",
                          errorMessage: null
                         },
      bitcoinInputColor: "default",
      fiatInputColor: "default",
      exchangeRates: {
        USD: null,
        RON: null,
        EUR: null,
        GBP: null,
      },
      exchangeRatesStatus: {
        USD: {status: "inProgress",
              errorMessage: null
             },
        RON: {status: "inProgress",
              errorMessage: null
             },
        EUR: {status: "inProgress",
              errorMessage: null
             },
        GBP: {status: "inProgress",
              errorMessage: null
             },
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
      this.setState(
        prevState => {
          let lastUpdated = prevState.lastUpdated;
          let lastUpdatedStatus = prevState.lastUpdatedStatus;

          lastUpdated = response.data.time.updated;
          lastUpdatedStatus = {status: "success",
                               errorMessage: null};
          return {lastUpdated, lastUpdatedStatus};
        }
    )})
    .catch(error => {
      this.setState(
        prevState => {
          let lastUpdated = prevState.lastUpdated;
          let lastUpdatedStatus = prevState.lastUpdatedStatus;

          lastUpdated = null;
          lastUpdatedStatus = {status: "error",
                               errorMessage: error.message};
          return {lastUpdated, lastUpdatedStatus};
        }
      );
    });
  }
    
  updateExchangeRateOnSuccess = (response, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesStatus = prevState.exchangeRatesStatus;
        
        exchangeRates[fiat] = response.data.bpi[fiat].rate_float;
        exchangeRatesStatus[fiat] = {status: "success",
                                     errorMessage: null};
        return {exchangeRates, exchangeRatesStatus} 
      }
    )
  }

  updateExchangeRateOnError = (error, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesStatus = prevState.exchangeRatesStatus;
        exchangeRates[fiat] = null;
        exchangeRatesStatus[fiat] = {status: "error",
                                     errorMessage: error.message};
        return {exchangeRates, exchangeRatesStatus} 
      }
    )
  }
  
  refresh = () => {
    let currentFiat = this.state.currentFiat;
    this.setState(prevState => {
      let lastUpdatedStatus = prevState.lastUpdatedStatus;
      let exchangeRatesStatus = prevState.exchangeRatesStatus;
      lastUpdatedStatus.status = "inProgress";
      exchangeRatesStatus.USD.status = "inProgress";
      return {lastUpdatedStatus, exchangeRatesStatus};
    })
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
          <BitcoinInUSD USDValue={this.state.exchangeRates["USD"]} 
                        USDStatus={this.state.exchangeRatesStatus["USD"]}
                        lastUpdated={this.state.lastUpdated}
                        lastUpdatedStatus={this.state.lastUpdatedStatus}
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

