import React, { Component } from 'react';
import { Row, Col } from 'antd';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import ReloadButton from '../components/ReloadButton';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate, getHistoricalData } from '../apiCalls';
import moment from 'moment';


class HistoricalData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastUpdated: null,
      lastUpdatedStatus: {status: "inProgress",
                          errorMessage: null
                         },               
      exchangeRateUSD: null, 
      exchangeRateUSDStatus: {status: "inProgress",
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
    this.fetchLastUpdatedUSDRate = this.fetchLastUpdatedUSDRate.bind(this);
    this.updateExchangeRateOnSuccess = this.updateExchangeRateOnSuccess.bind(this);
    this.updateExchangeRateOnError = this.updateExchangeRateOnError.bind(this);
    this.fetchHistoricalData = this.fetchHistoricalData.bind(this);
  }
  
  componentDidMount() { 
    this.fetchHistoricalData(this.state.startDate.format('YYYY-MM-DD'), 
                             this.state.endDate.format('YYYY-MM-DD'))
      .finally(() => Promise.all([
        this.fetchRateForFiat("USD"),
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

  updateExchangeRateOnSuccess = (response, fiat) => {
    this.setState(
      prevState => {
        let exchangeRateUSD = prevState.exchangeRateUSD;
        let exchangeRateUSDStatus = prevState.exchangeRateUSDStatus;
        exchangeRateUSD = response.data.bpi[fiat].rate_float;
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
      );
    })
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
    })
  }

  fetchHistoricalData = (startDate, endDate) => getHistoricalData(startDate, endDate)
    .then(response => {
      this.setState({
        chartData: {
          labels: Object.keys(response.data.bpi),
          datasets:[
            {
              label:`Rates during ${this.state.startDate.format('YYYY-MM-DD')} and ${this.state.endDate.format('YYYY-MM-DD')}`,
              data: Object.values(response.data.bpi),
              borderColor: "#4A761D"
            }
          ]
        }, 
        chartDataStatus: {status: "success",
                         errorMessage: null}});
    })
    .catch(error => {
      this.setState({
        chartData: {},
        chartDataStatus: {status: "error",
                          errorMessage: error.message}
      });
    })  
  
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
            <BitcoinInUSD USDValue={this.state.exchangeRateUSD}
                          USDStatus={this.state.exchangeRateUSDStatus} 
                          lastUpdated={this.state.lastUpdated}
                          lastUpdatedStatus={this.state.lastUpdatedStatus}
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