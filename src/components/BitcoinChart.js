import React from 'react';
import { Line } from 'react-chartjs-2';

const BitcoinChart = (props) => {
    console.log(props)
    const chartData = JSON.parse(JSON.stringify(props.data));
    console.log(chartData)
    return (
        <>
            {
                "labels" in chartData ?    
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
                    />  : <span></span> 
                
            }
        </>
               
        )
    }

export default BitcoinChart;

