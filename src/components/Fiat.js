import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const Fiat = (props) => {

    return (
        <React.Fragment>
            <span>Fiat </span> 
            <Select defaultValue={props.fiatCurrency} style={{ width: 120 }} onChange={props.handleChange}>
                <Option value="USD">USD</Option>
                <Option value="RON">RON</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
            </Select>
        </React.Fragment>
    );
}

export default Fiat;