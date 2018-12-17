import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import LastUpdatedUSDRate from '../components/LastUpdatedUSRate';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate } from '../apiCalls';
import ls from 'local-storage';

class LastBitcoinInUSDRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchangeRateUSD: null, 
            exchangeRateUSDStatus: {status: "inProgress",
                                    errorMessage: null
                                    },
            lastUpdated: null,
            lastUpdatedStatus: {status: "inProgress",
                                errorMessage: null
                                }
        };
        this.fetchRateForFiat = this.fetchRateForFiat.bind(this);
        this.updateExchangeRateOnSuccess = this.updateExchangeRateOnSuccess.bind(this);
        this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
        this.fetchLastUpdatedUSDRate = this.fetchLastUpdatedUSDRate.bind(this);
        this.updateLastUpdatedOnSuccess = this.updateLastUpdatedOnSuccess.bind(this);
        this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
    }

    componentDidMount() {
        this.fetchRateForFiat("USD");
        this.fetchLastUpdatedUSDRate();

    }

    fetchRateForFiat = (fiat) => {
        let rateKey = fiat;
        let rateInLocalStorage = ls.get(rateKey);
        let rateTimestampKey = `${fiat}Timestamp`;
        let rateTimestampInLocalStorage = ls.get(rateTimestampKey);
        let now = new Date();
        let rateDate = rateTimestampInLocalStorage && new Date(parseInt(rateTimestampInLocalStorage));
        let rateDateAge = Math.round((now - rateDate)/(1000 * 60));
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
    
    updateExchangeRateOnSuccess = (rate, fiat) => {
        this.setState(
            prevState => {
                let exchangeRateUSD = prevState.exchangeRateUSD;
                let exchangeRateUSDStatus = prevState.exchangeRateUSDStatus;
                exchangeRateUSD = rate;
                exchangeRateUSDStatus = {status: "success",
                                        errorMessage: null};
                return {exchangeRateUSD, exchangeRateUSDStatus};
            }
        )
    }
      
    updateExchangeRateOnError = (error, fiat) => {
        this.setState(
            prevState => {
                let exchangeRateUSD = prevState.exchangeRateUSD;
                let exchangeRateUSDStatus = prevState.exchangeRateUSDStatus;
                exchangeRateUSD = null;
                exchangeRateUSDStatus = {status: "error",
                                        errorMessage: error.message};
                return {exchangeRateUSD, exchangeRateUSDStatus};
            }
        )
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

    render() {
        return(
            <div>
                <BitcoinInUSD USDValue={this.state.exchangeRateUSD}
                              USDStatus={this.state.exchangeRateUSDStatus}
                />
                <LastUpdatedUSDRate lastUpdated={this.state.lastUpdated}
                                    lastUpdatedStatus={this.state.lastUpdatedStatus}
                />
            </div>

        )
    }
}

export default LastBitcoinInUSDRate;