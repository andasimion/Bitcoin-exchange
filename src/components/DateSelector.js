import React from 'react';
import { DatePicker} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const disabledDate = (current) => {
    return (current && current < moment("2010-07-16", dateFormat).endOf()) || current > moment().subtract(1, "days");
}


const DateSelector = (props) => {
    return (
        <React.Fragment>
            <RangePicker 
                value={[props.startDate, props.endDate]}
                onChange={props.onChange}
                format={dateFormat}

                disabledDate={disabledDate}

                dateRender={(current) => {
                    const style = {};
                    if (current.date() === 1) {
                        style.border = '1px solid #1890ff';
                        style.borderRadius = '50%';
                    }
                    return (
                        <div className="ant-calendar-date" style={style}>
                            {current.date()}
                        </div>
                    );
                }}
            />
        </React.Fragment>
    );
}

DateSelector.propTypes = { 
    value: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
}

export default DateSelector;