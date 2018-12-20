import React, { Component } from 'react';
import { Row, Col } from 'antd';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import ReloadButton from '../components/ReloadButton';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate, getHistoricalData } from '../apiCalls';
import moment from 'moment';
import ls from 'local-storage';


class HistoricalData extends Component {
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
                          },           
      startDate: moment().subtract(7, "days"),
      endDate: moment().subtract(1, "day"),
      chartData: {}, 
      chartDataStatus: {status: "inProgress",
                        errorMessage: null},
    }
    
    this.onChange = this.onChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.fetchRateForFiat = this.fetchRateForFiat.bind(this);
    this.updateExchangeRateOnSuccess = this.updateExchangeRateOnSuccess.bind(this);
    this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
    this.fetchLastUpdatedUSDRate = this.fetchLastUpdatedUSDRate.bind(this);
    this.updateLastUpdatedOnSuccess = this.updateLastUpdatedOnSuccess.bind(this);
    this.updateLastUpdatedOnError = this.updateLastUpdatedOnError.bind(this);
    this.fetchHistoricalData = this.fetchHistoricalData.bind(this);
    this.updateHistoryDataOnSuccess = this.updateHistoryDataOnSuccess.bind(this);
    this.updateHistoryDataOnError = this.updateHistoryDataOnError.bind(this);
  }
  
  componentDidMount() { 
    this.fetchHistoricalData(this.state.startDate.format('YYYY-MM-DD'), 
                             this.state.endDate.format('YYYY-MM-DD'))
      .finally(() => Promise.all([
        this.fetchRateForFiat("USD"),
        this.fetchLastUpdatedUSDRate()
      ])
    )  
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
  
  fetchHistoricalData = (startDate, endDate) => {
    
    return getHistoricalData(startDate, endDate)
    .then(response => {
      let newHistoricalData = response.data.bpi;
      this.updateHistoryDataOnSuccess(newHistoricalData);
    })
    .catch(error => {
      this.updateLastUpdatedOnError(error);
    }) 
  }

  updateHistoryDataOnSuccess = (historicalData) => {
    this.setState({
      chartData: {
        labels: Object.keys(historicalData),
        datasets:[
          {
            label:`Rates during ${this.state.startDate.format('YYYY-MM-DD')} and ${this.state.endDate.format('YYYY-MM-DD')}`,
            data: Object.values(historicalData),
            borderColor: "#4A761D"
          }
        ]
      }, 
      chartDataStatus: {status: "success",
                       errorMessage: null}});
  }

  updateHistoryDataOnError = (error) => {
    this.setState({
      chartData: {},
      chartDataStatus: {status: "error",
                        errorMessage: error.message}
    });
  }
  
  onChange = (dates, dateStrings) => {
    this.setState(prevState => {
      let chartDataStatus = prevState.chartDataStatus;
      chartDataStatus.status = "inProgress";
      return {chartDataStatus};
    })
    this.setState({startDate: dates[0],
                   endDate: dates[1]
                  });
    this.fetchHistoricalData(dateStrings[0], dateStrings[1])

  }

  refresh = () => {
    this.setState(prevState => {
      let lastUpdatedStatus = prevState.lastUpdatedStatus;
      let exchangeRateUSDStatus = prevState.exchangeRateUSDStatus;
      let chartDataStatus = prevState.chartDataStatus;
      let startDate = prevState.startDate;
      let endDate = prevState.endDate;
      lastUpdatedStatus.status = "inProgress";
      exchangeRateUSDStatus.status = "inProgress";
      chartDataStatus.status = "inProgress";
      startDate = moment().subtract(7, "days");
      endDate = moment().subtract(1, "days");
      return {lastUpdatedStatus, exchangeRateUSDStatus, chartDataStatus, startDate, endDate};
    })
    this.fetchHistoricalData(moment().subtract(7, "days").format('YYYY-MM-DD'), 
                             moment().subtract(1, "days").format('YYYY-MM-DD'))
      .finally(() => Promise.all([
        this.fetchRateForFiat("USD"),
        this.fetchLastUpdatedUSDRate()
      ]))
  }

  render() {
    return (
      <> 
        <Row>
          <Col span={8}>
            <BitcoinInUSD USDStatus={this.state.exchangeRateUSDStatus}
                          USDValue={this.state.exchangeRateUSD}
                          lastUpdatedStatus={this.state.lastUpdatedStatus}
                          lastUpdated={this.state.lastUpdated}
            />
          </Col> 
          <Col span={1} offset={15}>
            <ReloadButton refresh={this.refresh}/>
          </Col>
        </Row>
        <br/>
        <DateSelector startDate={this.state.startDate} 
                        endDate={this.state.endDate}
                        onChange={this.onChange}
        />
        <br/>
        <br/>
        <BitcoinChart data={this.state.chartData}
                      dataStatus={this.state.chartDataStatus}/>
      </>
    )
  }
}

export default HistoricalData;