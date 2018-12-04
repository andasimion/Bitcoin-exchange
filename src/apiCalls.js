import axios from 'axios';

export const getLastUpdatedBTCInUSDExchangeRate = () => {
    return axios.get(`https://api.coindesk.com/v1/bpi/currentprice/usd.json`);
}


export const getLatestBTCInFiatExchangeRate = (fiat) => {
    return axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${fiat}.json`)
}


export const getHistoricalData = (startDate, endDate) => {
    return axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`)
    }

