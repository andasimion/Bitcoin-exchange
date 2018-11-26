import axios from 'axios';

export const getLastUpdatedBTCInUSDExchangeRate = (callback) => {
    axios.get(`https://api.coindesk.com/v1/bpi/currentprice/usd.json`)
        .then(res => {
            let lastUpdated = res.data.time.updated;
            callback(lastUpdated);
        })
    }

export const getLatestBTCInFiatExchangeRate = (fiat, callback) => {
    axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${fiat}.json`)
        .then(res => {
            let fiatValue = res.data.bpi[fiat].rate_float;
            callback(fiatValue);
        })
    }

export const getHistoricalData = (startDate, endDate, callback) => {
    axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`)
        .then(res => {
            let historicalData = res.data.bpi;
            console.log(Object.keys(historicalData));
            console.log(Object.values(historicalData))
            callback(historicalData);
        })
    }

