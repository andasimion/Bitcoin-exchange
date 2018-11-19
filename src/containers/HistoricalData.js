import React, { Component } from 'react';
import { Layout } from 'antd';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import getLatestBTCExchangeRate from '../apiCalls';

const { Content } = Layout;

class HistoricalData extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      bitcoinInUSD: null,
      lastUpdated: null,
    };
    getLatestBTCExchangeRate((latestBTCExchangeRate) => this.setState(latestBTCExchangeRate));
  }
  
  render() {
    return ( 
      <Layout>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <BitcoinInUSD value={this.state.bitcoinInUSD} lastUpdated={this.state.lastUpdated}/>  
          </div>
          <br/>
          <div>
            <DateSelector />
          </div>
            </Content>
      </Layout>
    )
  }
}

export default HistoricalData;