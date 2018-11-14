import React from 'react';
import { Layout } from 'antd';
import SideMenu from '../components/SideMenu';
import BitcoinInUSD from '../components/BitcoinInUSD';
import DateSelector from '../components/DateSelector';

const { Header, Footer, Sider, Content } = Layout;

const HistoricalDataPage = () => {
    return (
        <React.Fragment>
        <Layout>
            <Header style={{ background: '#9099A2', textAlign: 'center'}}>Bitcoin currency</Header>
            <Layout>
              <Sider width={200} style={{ background: '#000' }}>
              <SideMenu />
              </Sider>  
              <Layout>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                  <React.Fragment>
                    <BitcoinInUSD />  
                  </React.Fragment>
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

export default HistoricalDataPage;