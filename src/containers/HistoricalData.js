import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate, getHistoricalData  } from '../apiCalls';


class HistoricalData extends Component {
  constructor(props) {
    console.log('constructor')
    super(props);
    this.state = {
      lastUpdated: null,
      exchangeRateUSD: null,
      startDateMoment: null,
      endDateMoment: null,
      chartData: {} 
    }
    
    this.onChange = this.onChange.bind(this);

    getLastUpdatedBTCInUSDExchangeRate((lastUpdated) => {this.setState({lastUpdated})});
    getLatestBTCInFiatExchangeRate("USD", USDValue => this.setState({exchangeRateUSD: USDValue}));

  }
  
  onChange = (dates, dateStrings) => {
    console.log('onChange')
    this.setState({startDateMoment: dates[0],
                   endDateMoment: dates[1]
                  });
    getHistoricalData(dateStrings[0], dateStrings[1], historicalData =>  this.setState({
      chartData: {
       labels: Object.keys(historicalData),
       datasets:[
           {
            label:`Rates during ${dateStrings[0]} and ${dateStrings[1]}`,
            data: Object.values(historicalData),
            borderColor: "#4A761D"
            }
          ]
      } 
    }))
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
}

export default HistoricalData;

