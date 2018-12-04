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
      lastUpdatedError: null,
      exchangeRateUSD: null,
      exchangeRateUSDError: null,
      startDate: moment().subtract(7, "days"),
      endDate: moment().subtract(1, "day"),
      chartData: {}, 
      chartDataError: null
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
    this.fetchRateForFiat("USD");
    this.fetchLastUpdatedUSDRate();
    this.fetchHistoricalData(this.state.startDate.format('YYYY-MM-DD'), 
                             this.state.endDate.format('YYYY-MM-DD'));
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
        let exchangeRateUSDError = prevState.exchangeRateUSDError;
        
        exchangeRateUSD = response.data.bpi[fiat].rate_float;
        exchangeRateUSDError = null;
        return {exchangeRateUSD, exchangeRateUSDError} 
      }
    )
  }
  
  updateExchangeRateOnError = (error, fiat) => {
    this.setState(
      prevState => {
        let exchangeRateUSD = prevState.exchangeRateUSD;
        let exchangeRateUSDError = prevState.exchangeRateUSDError;
        exchangeRateUSD = null;
        exchangeRateUSDError = error.message;
        return {exchangeRateUSD, exchangeRateUSDError} 
      }
    )
  }

  fetchLastUpdatedUSDRate = () => {
    return getLastUpdatedBTCInUSDExchangeRate()
    .then(response => {
      this.setState({lastUpdated: response.data.time.updated,
                      lastUpdatedError: null});
    })
    .catch(error => {
      this.setState({lastUpdatedError: error.message,
                      lastUpdated: null});
    });
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
        chartDataError: null});
    })
    .catch(error => {
      this.setState({
        chartData: {},
        chartDataError: error.message
      });
    })  
  
  onChange = (dates, dateStrings) => {
    this.setState({startDate: dates[0],
                   endDate: dates[1]
                  });
    this.fetchHistoricalData(dateStrings[0], dateStrings[1])

  }

  refresh = (e) => {
    console.log("refresh")
    this.fetchHistoricalData(moment().subtract(7, "days").format('YYYY-MM-DD'),
                             moment().subtract(1, "days").format('YYYY-MM-DD'));
  }

  render() {
    return (
      <> 
        <Row>
          <Col span={8}>
            <BitcoinInUSD value={this.state.exchangeRateUSD}
                          valueError={this.state.exchangeRateUSDError} 
                          lastUpdated={this.state.lastUpdated}
                          lastUpdatedError={this.state.lastUpdatedError}
            /> 
          </Col> 
          <Col span={1} offset={15}>
            <ReloadButton refresh={this.refresh}/>
          </Col>
        </Row>
        <br/>
        <div>
          <DateSelector startDate={this.state.startDate} 
                        endDate={this.state.endDate}
                        onChange={this.onChange}
          />
        </div>
        <div>
            <BitcoinChart data={this.state.chartData}
            />
        </div>
      </>
    )
  }
}

export default HistoricalData;

