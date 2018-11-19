import React, { Component } from 'react';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';


class Calculator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div>
          <Fiat />
        </div>
        <br/>
        <div>
          <BitcoinInUSD />  
        </div>
        <br/>
        <div>
          <ExchangeCalculator />
        </div>
      </>
    );
  }
}

export default Calculator;