import React from 'react';
import { Alert } from 'antd';
import { Line } from 'react-chartjs-2';

const BitcoinChart = (props) => {
    const chartData = {...props.data};

    return (
        <>
        {
        Object.getOwnPropertyNames(chartData).length === 0 ? 
            <Alert 
            message="Error"
            description={props.dataError}
            type="error"
            showIcon /> 
            :
            <Line
                data={chartData}
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
            />  
        }
        </>     
        )
    }

export default BitcoinChart;

