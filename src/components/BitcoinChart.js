import React from 'react';
import { Line } from 'react-chartjs-2';

const BitcoinChart = (props) => {
    return (
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
        />     
        )
    }

export default BitcoinChart;

