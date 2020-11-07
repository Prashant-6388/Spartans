import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

class BarChart extends Component {
    render() {
        const options = {
            title: {
                display: true,
                text: 'Page Usage Statitics - Monthly',
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            }
        };
        return (
            <div>
                <Chart type="bar" data={this.props.input} options={options} width="762px" height="381px" />
            </div>
        );
    }
}

export default BarChart;