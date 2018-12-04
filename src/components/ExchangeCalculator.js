import React from 'react';
import { Input, Row, Col } from 'antd';
import PropTypes from 'prop-types';

const InputGroup = Input.Group;

const ExchangeCalculator = (props) => {
    return (
        <>
            <div>Exchange Calculator: </div>
            <br/>
            <div>
                <Row gutter={16}>
                    <InputGroup compact>
                        <Col xs={{ span: 8, offset: 0 }} >
                            <span>BTC</span>
                            <Input style={{borderColor: props.bitcoinInputColor}} 
                                    value={props.bitcoinAmount} 
                                    onChange={props.convertBitcoinToFiat }
                                />
                            <span style={{color: props.bitcoinInputColor}}>
                                {props.bitcoinInputColor === "red" ? "Provide a number greater than 0" : ""}
                            </span>
                        </Col>
                        
                        <Col xs={{ span: 8, offset: 1 }} >
                            <span>{props.fiatCurrency}</span>
                            <Input style={{borderColor: props.fiatInputColor}}
                                    value={props.fiatAmount}
                                    onChange={props.convertFiatToBitcoin}
                                />
                            <span style={{color: props.fiatInputColor}}>
                                {props.fiatInputColor === "red" ? "Provide a number greater than 0" : ""}
                            </span>
                        </Col>
                    </InputGroup>
                </Row> 
            </div>
        </>
    );
}

ExchangeCalculator.propTypes = {
    bitcoinAmount: PropTypes.string,
    fiatAmount: PropTypes.string,
    convertBitcoinToFiat: PropTypes.func,
    convertFiatToBitcoin: PropTypes.func
}

export default ExchangeCalculator;
