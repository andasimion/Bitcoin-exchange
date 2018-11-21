import React, { Component } from 'react';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import PropTypes from 'prop-types';


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

HistoricalData.propTypes = {
  lastUpdated: PropTypes.string,
  exchangeRates: PropTypes.objectOf(PropTypes.number)
}


export default HistoricalData;