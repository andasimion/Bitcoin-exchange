import React from 'react';
import { Alert } from 'antd';
import { Line } from 'react-chartjs-2';

const BitcoinChart = (props) => {
    return (
        <>
        {props.chartDataError !== null ? 
            <Line
                data={props.data}
                options={{
                    title:{
                        display: true,
                        text: 'Rates for Bitcoin in USD',
                        fontSize: 25
                        },
                    legend:{
                        display: true,
                        position: 'top',
                        }
                }}
            /> :
            <Alert 
            message="Error"
            description={props.chartDataError}
            type="error"
            showIcon />
        }
        </>     
        )
    }

export default BitcoinChart;

