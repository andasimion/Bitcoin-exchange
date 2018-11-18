import React from 'react';
import { Input, Row, Col} from 'antd';

const InputGroup = Input.Group;

const ExchangeCalculator = () => {
    return (
        <React.Fragment>
            <div>Exchange Calculator: </div>
            <br/>
            <div>
            <Row gutter={16}>
                <InputGroup compact>
                    <Col xs={{ span: 8, offset: 0 }} >
                        <span>BTC </span>
                        <Input style={{ width: '100%' }} />
                    </Col>
                    
                    <Col xs={{ span: 8, offset: 1 }} >
                        <span>USD </span>
                        <Input style={{ width: '100%' }} />
                    </Col>
                </InputGroup>
            </Row> 

            </div>
        </React.Fragment>
    );
}

export default ExchangeCalculator;
