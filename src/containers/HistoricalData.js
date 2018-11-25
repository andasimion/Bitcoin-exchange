import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate  } from '../apiCalls';
import PropTypes from 'prop-types';


class HistoricalData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastUpdated: null,
      exchangeRateUSD: null,
      startDate: null,
      endDate: null,
      historicalData : {}
    }
  
    getLastUpdatedBTCInUSDExchangeRate((lastUpdated) => {this.setState({lastUpdated})} );
    getLatestBTCInFiatExchangeRate("USD", USDValue => this.setState({exchangeRateUSD: USDValue}));

    this.onCalendarChange = this.onCalendarChange.bind(this);

  }

  onCalendarChange = (dates, dateStrings) => {
    this.setState({startDate: dates[0],
                    endDate: dates[1]});
    console.log(dates);
  }

  render() {
    return (
      <> 
        <div>
          <BitcoinInUSD value={this.state.exchangeRateUSD} lastUpdated={this.state.lastUpdated}/>  
        </div>
        <br/>
        <div>
          <DateSelector startDate={this.state.startDate} endDate={this.state.endDate}
          onCalendarChange={this.onCalendarChange}/>
        </div>
      </>
    )
  }
}

HistoricalData.propTypes = {
  lastUpdated: PropTypes.string,
  exchangeRates: PropTypes.objectOf(PropTypes.number)
}


export default HistoricalData;