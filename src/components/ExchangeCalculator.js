import React from 'react';
import { Input, Select, Row, Col} from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;

const ExchangeCalculator = () => {
    return (
        <React.Fragment>
            <div>Exchange Calculator: </div>
            <div>
            <Row>
                <InputGroup compact>
                    <Col xs={{ span: 8, offset: 1 }} >
                    <Select defaultValue="BTC">
                        <Option value="BTC">BTC</Option>
                    </Select>
                    <Input style={{ width: '75%' }} />
                    </Col>
                    <Col xs={{ span: 8, offset: 1 }} >
                    <Select defaultValue="USD">
                        <Option value="USD">USD</Option>
                        <Option value="RON">RON</Option>
                        <Option value="EUR">EUR</Option>
                        <Option value="GBP">GBP</Option>
                    </Select>
                    <Input style={{ width: '75%' }} />
                    </Col>
                </InputGroup>
            </Row> 

            </div>
        </React.Fragment>
    );
}

export default ExchangeCalculator;
