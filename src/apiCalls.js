import axios from 'axios';

export const getLastUpdatedBTCInUSDExchangeRate = () => {
    return axios.get(`https://api.coindesk.com/v1/bpi/currentprice/usd.json`);
}


export const getLatestBTCInFiatExchangeRate = (fiat) => {
    return axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${fiat}.json`)
}


export const getHistoricalData = (startDate, endDate, callback) => {
    axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`)
        .then(res => {
            let historicalData = res.data.bpi;
            callback(historicalData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

