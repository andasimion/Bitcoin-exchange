import React, { Component } from 'react';
import { Layout } from 'antd';
import SideMenu from '../components/SideMenu';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';
import getLatestBTCExchangeRate from '../apiCalls';

const { Header, Footer, Sider, Content } = Layout;

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
        <React.Fragment>
        <Layout style={{height:"100vh"}}>
            <Header style={{ background: '#9099A2', textAlign: 'center'}}>Bitcoin currency</Header>
            <Layout>
              <Sider width={200} style={{ background: '#000' }}>
              <SideMenu defaultSelectedKeys={['2']}/>
              </Sider>  
              <Layout>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                  <React.Fragment>
                    <BitcoinInUSD value={this.state.bitcoinInUSD} lastUpdated={this.state.lastUpdated}/>  
                  </React.Fragment>
                  <br/>
                  <React.Fragment>
                    <DateSelector />
                  </React.Fragment>
                </Content>
              </Layout>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Info provided by www.coindesk.com</Footer>
        </Layout>
      </React.Fragment>
    );
  }
}

export default HistoricalData;