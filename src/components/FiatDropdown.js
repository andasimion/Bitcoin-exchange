import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const FiatDropdown = (props) => {

    return (
        <>
            <span>Fiat </span> 
            <Select defaultValue={props.fiatCurrency} style={{ width: 120 }} onChange={props.handleChange}>
                <Option value="USD">USD</Option>
                <Option value="RON">RON</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
            </Select>
        </>
    );
}

FiatDropdown.propTypes = {
    fiatCurrency: PropTypes.string,
    handleChange: PropTypes.func,
}


export default FiatDropdown;