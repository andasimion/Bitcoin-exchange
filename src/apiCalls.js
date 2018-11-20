import axios from 'axios';

export const getLatestBTCInUSDExchangeRate = (callback) => {
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
            //console.log(fiatValue); this is working
            callback(fiatValue);
        })
    }

