import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate, getHistoricalData  } from '../apiCalls';
import PropTypes from 'prop-types';


class HistoricalData extends Component {
  constructor(props) {
    console.log('constructor')
    super(props);
    this.state = {
      lastUpdated: null,
      exchangeRateUSD: null,
      startDateMoment: null,
      startDateString: null,
      endDateMoment: null,
      endDateString:null,
      chartData: {} 
    }
    
    this.onChange = this.onChange.bind(this);

    getLastUpdatedBTCInUSDExchangeRate((lastUpdated) => {this.setState({lastUpdated})});
    getLatestBTCInFiatExchangeRate("USD", USDValue => this.setState({exchangeRateUSD: USDValue}));

  }
  
  onChange = (dates, dateStrings) => {
    console.log('onChange')
    this.setState({startDateMoment: dates[0],
                   endDateMoment: dates[1],
                   startDateString: dateStrings[0],
                   endDateString: dateStrings[1]
                  });
  }

  render() {
    console.log("Render")
    return (
      <> 
        <div>
          <BitcoinInUSD value={this.state.exchangeRateUSD} 
                        lastUpdated={this.state.lastUpdated}
          />  
        </div>
        <br/>
        <div>
          <DateSelector startDate={this.state.startDateMoment} 
                        endDate={this.state.endDateMoment}
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

  componentDidUpdate(prevProps, prevState) {
    console.log("before making the API call");
    console.log("prevState", prevState);
    if (this.state.startDateString !== prevState.startDateString || this.state.endDateString !== prevState.endDateString ){
      console.log("after making the API call");
      getHistoricalData(this.state.startDateString, this.state.endDateString, historicalData =>  this.setState({
        chartData: {
          labels: Object.keys(historicalData),
          datasets:[
            {
              label:`Rates during ${this.state.startDateString} and ${this.state.endDateString}`,
              data: Object.values(historicalData),
              backgroundColor: 'green'
            }
          ]
        } 
      }))
      console.log("State", this.state)
    }

  }

}

HistoricalData.propTypes = {
  lastUpdated: PropTypes.string,
}


export default HistoricalData;

