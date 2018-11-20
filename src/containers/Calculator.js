import React, { Component } from 'react';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFiat: "USD",
      bitcoinAmount: null,
      fiatAmount: null
    };
  this.setNewFiatCurrency = this.setNewFiatCurrency.bind(this);
  this.convertBitcoinToFiat  = this.convertBitcoinToFiat.bind(this);
  this.convertFiatToBitcoin  = this.convertFiatToBitcoin.bind(this);
  }

  setNewFiatCurrency = (value) => {
    this.setState({currentFiat: value})
  }

  convertBitcoinToFiat = (bitcoinAmount) => {
    let fiatAmount = bitcoinAmount * this.props.exchangeRates[this.state.currentFiat];
    console.log(this.props.exchangeRates[this.state.currentFiat])
    this.setState({bitcoinAmount, fiatAmount});
  }

  convertFiatToBitcoin = (fiatAmount) => {
    let bitcoinAmount = fiatAmount / this.props.exchangeRates[this.state.currentFiat];
    this.setState({bitcoinAmount, fiatAmount});
  }

  render() {
    return (
      <>
        <div>
          <Fiat fiatCurrency={this.state.currentFiat} handleChange={this.setNewFiatCurrency}/>
        </div>
        <br/>
        <div>
          <BitcoinInUSD value={this.props.exchangeRates.USD} lastUpdated={this.props.lastUpdated}/>  
        </div>
        <br/>
        <div>
          <ExchangeCalculator fiatCurrency={this.state.currentFiat} 
              convertBitcoinToFiat ={this.convertBitcoinToFiat }
              convertFiatToBitcoin={this.convertFiatToBitcoin}
              bitcoinAmount={this.state.bitcoinAmount}
              fiatAmount={this.state.fiatAmount}/>
        </div>
      </>
    );
  }
}

export default Calculator;