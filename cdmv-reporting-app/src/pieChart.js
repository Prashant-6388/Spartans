import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

class PieChart extends Component {
    render() {
        const options = {
            title: {
                display: true,
                text: 'Page Usage Statitics - Total',
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            }
        };
        return (
            <div>
                <Chart type="pie" data={this.props.input} options={options} width="762px" height="381px"/>
            </div>
        );        
    }
}

export default PieChart;