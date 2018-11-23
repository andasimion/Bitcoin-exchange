import React from 'react';
import { DatePicker} from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const DateSelector = () => {
    return (
        <React.Fragment>
            <RangePicker
                format={dateFormat}

                disabledDate={(current) => {
                    return current && current < moment().endOf(day) ;
                }}
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

export default DateSelector;