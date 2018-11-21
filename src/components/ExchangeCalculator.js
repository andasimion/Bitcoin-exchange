import React from 'react';
import { Input, Row, Col} from 'antd';
import PropTypes from 'prop-types';


const ExchangeCalculator = (props) => {
    return (
        <React.Fragment>
            <div>Exchange Calculator: </div>
            <br/>
            <div>
            <Row gutter={16}>
                    <Col xs={{ span: 8, offset: 0 }} >
                        <span>BTC </span>
                        <Input style={{ width: '100%' }} defaultValue={props.bitcoinAmount} 
                                    onChange={props.convertBitcoinToFiat }/>
                    </Col>
                    
                    <Col xs={{ span: 8, offset: 1 }} >
                        <span>{props.fiatCurrency} </span>
                        <Input style={{ width: '100%' }} defaultValue={props.fiatAmount}
                                    onChange={props.convertFiatToBitcoin}/>
                    </Col>

            </Row> 

            </div>
        </React.Fragment>
    );
}

ExchangeCalculator.propTypes = {
    //bitcoinAmount: PropTypes.number,
    //fiatAmount: PropTypes.number,
    convertBitcoinToFiat: PropTypes.func,
    convertFiatToBitcoin: PropTypes.func
}

export default ExchangeCalculator;
