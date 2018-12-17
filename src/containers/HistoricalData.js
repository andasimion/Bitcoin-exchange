import React, { Component } from 'react';
import { Row, Col } from 'antd';
import LastBitcoinInUSDRate from './LastBitcoinInUSDRate';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import ReloadButton from '../components/ReloadButton';
import { getHistoricalData } from '../apiCalls';
import moment from 'moment';


class HistoricalData extends Component {
  constructor(props) {
    super(props);
    this.state = {              
      startDate: moment().subtract(7, "days"),
      endDate: moment().subtract(1, "day"),
      chartData: {}, 
      chartDataStatus: {status: "inProgress",
                        errorMessage: null},
    }
    
    this.onChange = this.onChange.bind(this);
    //this.refresh = this.refresh.bind(this);
    this.fetchHistoricalData = this.fetchHistoricalData.bind(this);
    this.updateHistoryDataOnSuccess = this.updateHistoryDataOnSuccess.bind(this);
    this.updateHistoryDataOnError = this.updateHistoryDataOnError.bind(this);
  }
  
  componentDidMount() { 
    this.fetchHistoricalData(this.state.startDate.format('YYYY-MM-DD'), 
                             this.state.endDate.format('YYYY-MM-DD'));
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

  /*refresh = () => {
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
  }*/

  render() {
    return (
      <> 
        <Row>
          <Col span={8}>
            <LastBitcoinInUSDRate />
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