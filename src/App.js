import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import CalculatorPage from './pages/CalculatorPage';
import HistoricalDataPage from './pages/HistoricalDataPage';
import ErrorPage from './pages/ErrorPage';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={CalculatorPage} exact/>
          <Route path="/historicalData" component={HistoricalDataPage} />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
      
    );
  }
}

export default App;
