import React, { Component } from 'react';
import { Row, Col } from 'antd';
import FiatDropdown from '../components/FiatDropdown';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import ReloadButton from '../components/ReloadButton';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate } from '../apiCalls';
import ls from 'local-storage';



class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFiat: "USD",
      bitcoinAmount: null,
      fiatAmount: null,
      bitcoinInputClass: "successInput",
      fiatInputClass: "successInput",
      lastUpdated: null,
      lastUpdatedStatus: {status: "inProgress",
                          errorMessage: null
                          },  
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
      },
    };
  
  this.fetchLastUpdatedUSDRate = this.fetchLastUpdatedUSDRate.bind(this);
  this.updateLastUpdatedOnSuccess = this.updateLastUpdatedOnSuccess.bind(this);
  this.updateLastUpdatedOnError = this.updateLastUpdatedOnError.bind(this);
  this.setNewFiatCurrency = this.setNewFiatCurrency.bind(this);
  this.convertBitcoinToFiat  = this.convertBitcoinToFiat.bind(this);
  this.convertFiatToBitcoin  = this.convertFiatToBitcoin.bind(this);
  this.fetchRateForFiat = this.fetchRateForFiat.bind(this);
  this.fetchOtherFiatRates = this.fetchOtherFiatRates.bind(this);
  this.updateExchangeRateOnSuccess = this.updateExchangeRateOnSuccess.bind(this);
  this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
  this.fetchLastUpdatedUSDRate = this.fetchLastUpdatedUSDRate.bind(this);
  this.updateLastUpdatedOnSuccess = this.updateLastUpdatedOnSuccess.bind(this);
  this.updateLastUpdatedOnError = this.updateLastUpdatedOnError.bind(this);
 
  this.refresh = this.refresh.bind(this);
  } 

  componentDidMount() {
    this.fetchRateForFiat("USD")
      .finally(() => Promise.all([
        this.fetchOtherFiatRates("USD"),
        this.fetchLastUpdatedUSDRate()
      ]))
  }

  fetchRateForFiat = (fiat) => {
    let rateKey = fiat;
    let rateInLocalStorage = ls.get(rateKey); // null if rate is not in LocalStorage
    let rateTimestampKey = `${fiat}Timestamp`;
    let rateTimestampInLocalStorage = ls.get(rateTimestampKey);
    let now = new Date();
    //if rateTimestamp is in local storage rateDate is a date and if not rateDate is null
    let rateDate = rateTimestampInLocalStorage && new Date(parseInt(rateTimestampInLocalStorage)); 
    let rateDateAge = Math.round((now - rateDate)/(1000*60)); // null is converted to 0 
    let notTooOld = rateDateAge <= 1;

    if (rateInLocalStorage && notTooOld) {
      this.updateExchangeRateOnSuccess(rateInLocalStorage, fiat);
      return Promise.resolve(null);
    } else {
      return getLatestBTCInFiatExchangeRate(fiat)
      .then(response => {
        let newRate = response.data.bpi[fiat].rate_float;
        this.updateExchangeRateOnSuccess(newRate, fiat);
        ls.set(rateKey, newRate);
        ls.set(rateTimestampKey, Date.now());
      })
      .catch(error => {
        this.updateExchangeRateOnError(error, fiat);
      })
    }
  }

  fetchOtherFiatRates = (exceptFiat) => {
    let otherFiats = Object.keys(this.state.exchangeRates).filter((fiat) => fiat !== exceptFiat);
    let promises = otherFiats.map((fiat) => this.fetchRateForFiat(fiat))
    return Promise.all(promises);
  }

  updateExchangeRateOnSuccess = (rate, fiat) => {
    this.setState(
      prevState => {
        let exchangeRates = prevState.exchangeRates;
        let exchangeRatesStatus = prevState.exchangeRatesStatus;
        
        exchangeRates[fiat] = rate;
        exchangeRatesStatus[fiat] = {status: "success",
                                     errorMessage: null};
        return {exchangeRates, exchangeRatesStatus} 
      }
    );
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
    );
  }

  fetchLastUpdatedUSDRate = () => {
    let lastUpdatedUSDInLocalStorage = ls.get('lastUpdatedUSD');
    let lastUpdatedTimestampInLocalStorage= ls.get('lastUpdatedUSDTimestamp');
    let lastUpdatedDate = lastUpdatedTimestampInLocalStorage && new Date(parseInt(lastUpdatedTimestampInLocalStorage))
    let now = Date.now();
    let lastUpdatedDateAge = Math.round((now-lastUpdatedDate)/(1000*60))
    let notTooOld = lastUpdatedDateAge <= 1;
    if (lastUpdatedUSDInLocalStorage && notTooOld) {
        this.updateLastUpdatedOnSuccess(lastUpdatedUSDInLocalStorage);
        return Promise.resolve(null);
    } else {
        return getLastUpdatedBTCInUSDExchangeRate()
            .then(response => {
            let newLastUpdated = response.data.time.updated;
            this.updateLastUpdatedOnSuccess(newLastUpdated);
            ls.set('lastUpdatedUSD', newLastUpdated);
            ls.set('lastUpdatedUSDTimestamp', Date.now());
            })
        .catch(error => {
            this.updateLastUpdatedOnError(error);
        });
    }
  }

  updateLastUpdatedOnSuccess = (lastUpdatedValue) => {
      this.setState(
          prevState => {
              let lastUpdated = prevState.lastUpdated;
              let lastUpdatedStatus = prevState.lastUpdatedStatus;
      
              lastUpdated = lastUpdatedValue;
              lastUpdatedStatus = {status: "success",
                                  errorMessage: null};
              return {lastUpdated, lastUpdatedStatus};
          }
      )
  }

  updateLastUpdatedOnError = (error) => {
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
  }

  refresh = () => {
    let currentFiat = this.state.currentFiat;
    this.setState(prevState => {
      let lastUpdatedStatus = prevState.lastUpdatedStatus;
      let exchangeRatesStatus = prevState.exchangeRatesStatus;
      lastUpdatedStatus.status = "inProgress";
      exchangeRatesStatus.USD.status = "inProgress";
      return {lastUpdatedStatus, exchangeRatesStatus}
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
    console.log(bitcoinAmount)
    if(isNaN(bitcoinAmount) || parseFloat(bitcoinAmount) < 0) {
      this.setState({bitcoinInputClass: "errorInput"});
      return;
    } else {
      let fiatAmount = this.bitcoinPriceInFiat(bitcoinAmount, this.state.exchangeRates[this.state.currentFiat]);
      this.setState({
        bitcoinAmount: bitcoinAmount,
        fiatAmount: fiatAmount,
        bitcoinInputClass: "successInput"
      });
    }
  }

  convertFiatToBitcoin = (e) => {
    let fiatAmount = e.target.value;
    if (isNaN(fiatAmount) || parseFloat(fiatAmount) < 0) {
      this.setState({fiatInputClass: "errorInput"});
      return
    } else {
      let bitcoinAmount = String(fiatAmount / this.state.exchangeRates[this.state.currentFiat]);
      this.setState({
        bitcoinAmount:bitcoinAmount, 
        fiatAmount:fiatAmount,
        fiatInputClass: "successInput"
      })
    }
  }

  render() {
    return (
      <>
        <Row>
          <Col span={8}>
            <FiatDropdown fiatCurrency={this.state.currentFiat} 
                          handleChange={this.setNewFiatCurrency}
            /> 
          </Col>
          <Col span={1} offset={15}>
            <ReloadButton refresh={this.refresh}/>
          </Col>
        </Row>
        <br/>
        <div>
          <BitcoinInUSD USDStatus={this.state.exchangeRatesStatus["USD"]}
                        USDValue={this.state.exchangeRates["USD"]}
                        lastUpdatedStatus={this.state.lastUpdatedStatus}
                        lastUpdated={this.state.lastUpdated} 
          />  
        </div>
        <br/>
        <div>
          <ExchangeCalculator fiatCurrency={this.state.currentFiat} 
              convertBitcoinToFiat ={this.convertBitcoinToFiat}
              convertFiatToBitcoin={this.convertFiatToBitcoin}
              bitcoinAmount={this.state.bitcoinAmount}
              fiatAmount={this.state.fiatAmount}
              bitcoinInputClass={this.state.bitcoinInputClass}
              fiatInputClass={this.state.fiatInputClass}
          />
        </div>
      </>
    );
  }
}

export default Calculator;

