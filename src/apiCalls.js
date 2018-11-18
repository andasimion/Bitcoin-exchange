import axios from 'axios';

const getLatestBTCExchangeRate = (callback) => {
    axios.get(`https://api.coindesk.com/v1/bpi/currentprice/usd.json`)
        .then(res => {
            const bitcoinInUSD = res.data.bpi.USD.rate_float;
            const lastUpdated = res.data.time.updated;
            callback({bitcoinInUSD, lastUpdated});
        })
    }

export default getLatestBTCExchangeRate;