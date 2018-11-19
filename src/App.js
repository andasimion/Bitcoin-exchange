import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import SideMenu from './components/SideMenu';
import Calculator from './containers/Calculator';
import HistoricalData from './containers/HistoricalData';
import Error404 from './containers/Error404';
import './App.css';
import CurrentRates from './containers/CurrentRates';

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  
  render() {
    return (
      <React.Fragment>
        <Layout style={{height:"100vh"}}>
            <Header style={{ background: '#9099A2', textAlign: 'center'}}>Bitcoin currency</Header>
            <Layout>
              <BrowserRouter>
                <>
                  <Sider width={200} style={{ background: '#000' }}>
                    <SideMenu />
                  </Sider> 
                  <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                    <Switch>
                      <CurrentRates>
                        <Route path="/" component={Calculator} exact/>
                        <Route path="/historicalData" component={HistoricalData} /> 
                      </CurrentRates>   
                      <Route component={Error404} />
                    </Switch>
                  </Content>
                </>
              </BrowserRouter>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Info provided by www.coindesk.com</Footer>
        </Layout>
      </React.Fragment>
    );
  }
}

export default App;
