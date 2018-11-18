import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Calculator from './containers/Calculator';
import HistoricalData from './containers/HistoricalData';
import Error404 from './containers/Error404';
import './App.css';



class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Calculator} exact/>
          <Route path="/historicalData" component={HistoricalData} />
          <Route component={Error404} />
        </Switch>
      </BrowserRouter>
      
    );
  }
}

export default App;
