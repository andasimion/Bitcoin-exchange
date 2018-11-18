import React, { Component } from 'react';
import { Layout } from 'antd';
import SideMenu from '../components/SideMenu';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import getLatestBTCExchangeRate from '../apiCalls';

const { Header, Footer, Sider, Content } = Layout;

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
        <React.Fragment>
        <Layout style={{height:"100vh"}}>
            <Header style={{ background: '#9099A2', textAlign: 'center'}}>Bitcoin currency</Header>
            <Layout>
              <Sider width={200} style={{ background: '#000' }}>
              <SideMenu />
              </Sider>  
              <Layout>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                  <div>
                    <Fiat />
                  </div>
                  <br/>
                  <div>
                    <BitcoinInUSD value={this.state.bitcoinInUSD} lastUpdated={this.state.lastUpdated}/>  
                  </div>
                  <br/>
                  <div>
                    <ExchangeCalculator />
                  </div>
                </Content>
              </Layout>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Info provided by www.coindesk.com</Footer>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Calculator;