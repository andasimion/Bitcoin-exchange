import React from 'react';
import AlertError from './AlertError';
import Spinner from './Spinner';
import { Line } from 'react-chartjs-2';

const BitcoinChart = (props) => {
    const chartData = {...props.data};
    const spinner = <Spinner size="large" style={{display: 'flex', justifyContent: 'center'}}/>
    const alertError = <AlertError errorMessage={props.dataStatus.errorMessage} />
    return (
        <>
            {
            props.dataStatus.status === "inProgress" ? 
                spinner :
                    props.dataStatus.status === "error" ?
                        alertError:
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