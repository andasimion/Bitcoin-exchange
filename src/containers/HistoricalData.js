import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import BitcoinChart from '../components/BitcoinChart';
import { getLastUpdatedBTCInUSDExchangeRate, getLatestBTCInFiatExchangeRate, getHistoricalData  } from '../apiCalls';
import moment from 'moment';

class HistoricalData extends Component {
  constructor(props) {
    console.log('constructor')
    super(props);
    this.state = {
      lastUpdated: null,
      lastUpdatedError: null,
      exchangeRateUSD: null,
      exchangeRateUSDError: null,
      startDate: moment().subtract(7, "days"),
      endDate: moment(),
      chartData: {} 
    }
    
    this.onChange = this.onChange.bind(this);
  }
  
  componentDidMount() {
    console.log("componentDidMount")
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

    getLatestBTCInFiatExchangeRate("USD", USDValue => this.setState({exchangeRateUSD: USDValue}));
    getHistoricalData(this.state.startDate.format('YYYY-MM-DD'), 
                      this.state.endDate.format('YYYY-MM-DD'), 
                      historicalData =>  this.setState({
                        chartData: {
                          labels: Object.keys(historicalData),
                          datasets:[
                            {
                              label:`Rates during ${this.state.startDate.format('YYYY-MM-DD')} and ${this.state.startDate.format('YYYY-MM-DD')}`,
                              data: Object.values(historicalData),
                              borderColor: "#4A761D"
                            }
                          ]
                        } 
                  }));
  }


  onChange = (dates, dateStrings) => {
    console.log('onChange')
    this.setState({startDate: dates[0],
                   endDate: dates[1]
                  });
    getHistoricalData(dateStrings[0], 
                      dateStrings[1], 
                      historicalData =>  this.setState({
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
                     }));
  }


  render() {
    console.log("Render")
    return (
      <> 
        <div>
          <BitcoinInUSD value={this.state.exchangeRateUSD}
                        valueError={this.state.exchangeRateUSDError} 
                        lastUpdated={this.state.lastUpdated}
                        lastUpdatedError={this.state.lastUpdatedError}
          />  
        </div>
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

