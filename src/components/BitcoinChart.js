import React from 'react';
import { Alert } from 'antd';
import Spinner from './Spinner';
import { Line } from 'react-chartjs-2';

const BitcoinChart = (props) => {
    const chartData = {...props.data};

    return (
        <>
            {
            props.dataStatus.status === "inProgress" ? <Spinner size="large" style={{display: 'flex', justifyContent: 'center'}}/> :
                props.dataStatus.status === "error" ?
                    <Alert 
                    message="Error"
                    description={props.dataStatus.errorMessage}
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
                            }, 
                        maintainAspectRatio: true
                        }}
                    /> 
            }             
        </>    
        )
    }

export default BitcoinChart;

