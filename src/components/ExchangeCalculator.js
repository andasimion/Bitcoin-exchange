import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import PropTypes from 'prop-types';


const ExchangeCalculator = (props) => {
    return (
        <React.Fragment>
            <div>Exchange Calculator: </div>
            <br/>
            <div>
            <Form>
                <Row gutter={16}>
                    <Col xs={{ span: 8, offset: 0 }} >
                        <Form.Item
                          label="BTC"
                          colon={false}
                        >
                          <Input style={{ width: '100%' }} 
                                 type ={"number"} 
                                 value={props.bitcoinAmount} 
                                 onChange={props.convertBitcoinToFiat }
                                 validate={props.validate}
                                 message="Provide number greater than 0"/>
                        </Form.Item>            
                    </Col>
                    
                    <Col xs={{ span: 8, offset: 1 }} >
                        <Form.Item
                          label={props.fiatCurrency}
                          colon={false}
                          help="Provide number greater than 0"
                        >
                          <Input style={{ width: '100%' }} value={props.fiatAmount}
                                    onChange={props.convertFiatToBitcoin}/>
                        </Form.Item> 
                    </Col>

                </Row> 
            </Form>
            </div>
        </React.Fragment>
    );
}

ExchangeCalculator.propTypes = {
    bitcoinAmount: PropTypes.string,
    fiatAmount: PropTypes.string,
    convertBitcoinToFiat: PropTypes.func,
    convertFiatToBitcoin: PropTypes.func
}

export default ExchangeCalculator;
