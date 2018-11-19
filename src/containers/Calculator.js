import React, { Component } from 'react';
import { Layout } from 'antd';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import getLatestBTCExchangeRate from '../apiCalls';

const { Content } = Layout;

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      bitcoinInUSD: null,
      lastUpdated: null,
      targetCurrency: "USD",
      exchangeRate: null
    };
    getLatestBTCExchangeRate((latestBTCExchangeRate) => this.setState(latestBTCExchangeRate));
  }
  
  render() {
    return (
      <Layout>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Fiat />
          </div>
          <br/>
          <div>
            <BitcoinInUSD value={this.state.bitcoinInUSD} lastUpdated={this.state.lastUpdated}/>  
            <br/>
            <ExchangeCalculator />
          </div>
        </Content>
      </Layout>

            
    );
  }
}

export default Calculator;