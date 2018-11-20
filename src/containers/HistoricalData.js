import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';


class HistoricalData extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <> 
        <div>
          <BitcoinInUSD value={this.props.value} lastUpdated={this.props.lastUpdated}/>  
        </div>
        <br/>
        <div>
          <DateSelector />
        </div>
      </>
    )
  }
}

export default HistoricalData;