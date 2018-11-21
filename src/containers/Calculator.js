import React, { Component } from 'react';
import Fiat from '../components/Fiat';
import BitcoinInUSD from '../components/BitcoinInUSD';
import ExchangeCalculator from '../components/ExchangeCalculator';
import PropTypes from 'prop-types';


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
    this.setState({
                currentFiat: value,
                bitcoinAmount:null,
                fiatAmount: null
                  })
  }

  convertBitcoinToFiat = (e) => {
    let bitcoinAmount = e.target.value;
    let fiatAmount = bitcoinAmount * this.props.exchangeRates[this.state.currentFiat];
    this.setState({bitcoinAmount, fiatAmount});
  }

  convertFiatToBitcoin = (e) => {
    let fiatAmount = e.target.value;
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

Calculator.propTypes = {
  lastUpdated: PropTypes.string,
  exchangeRates: PropTypes.objectOf(PropTypes.number)
}

export default Calculator;