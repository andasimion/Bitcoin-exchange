import React, { Component } from 'react';
import { Row, Col } from 'antd';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import ReloadButton from '../components/ReloadButton';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate, getHistoricalData  } from '../apiCalls';
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
      endDate: moment(),
      chartData: {}, 
      chartDataError: null
    }
    
    this.makeApiCalls = this.makeApiCalls.bind(this);
    this.onChange = this.onChange.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  
  componentDidMount() {
    this.makeApiCalls()
  }

  makeApiCalls = () => {
    getLastUpdatedBTCInUSDExchangeRate()
      .then(response => {
        this.setState({lastUpdated: response.data.time.updated,
                    lastUpdatedError: null});
      })
      .catch(error => {
        this.setState({lastUpdatedError: error.message,
                    lastUpdated: null});
      });


    getLatestBTCInFiatExchangeRate ("USD")
      .then(response => {
        this.setState({exchangeRateUSD: response.data.bpi.USD.rate_float,
                       exchangeRateUSDError: null})
      })
      .catch(error => {
        this.setState({exchangeRateUSD: null,
                        exchangeRateUSDError: error.message})
      })
  
    getHistoricalData(this.state.startDate.format('YYYY-MM-DD'), 
                      this.state.endDate.format('YYYY-MM-DD')) 
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
  
  }

  onChange = (dates, dateStrings) => {
    this.setState({startDate: dates[0],
                   endDate: dates[1]
                  });
    getHistoricalData(dateStrings[0], dateStrings[1])
      .then(response => {
        this.setState({
          chartData: {
            labels: Object.keys(response.data.bpi),
            datasets:[
              {
                label:`Rates during ${dateStrings[0]} and ${dateStrings[1]}`,
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

  }

  refresh = (e) => {
    console.log("refresh")
    this.makeApiCalls();
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

