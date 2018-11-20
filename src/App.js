import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from 'antd';
import SideMenu from './components/SideMenu';
import CurrentRates from './containers/CurrentRates';
import './App.css';


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
                    <CurrentRates />
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
