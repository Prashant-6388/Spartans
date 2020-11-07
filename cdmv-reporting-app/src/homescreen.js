import React, { Component } from 'react';
import StickyFooter from './StickyFooter';
import BaseTemplate from './BaseTemplate';
import PieChart from './pieChart';
import BarChart from './barChart';


class Homescreen extends Component {
    render() {
        const dataForPieChart = {
            labels: ['T1 Report', 'Rexa Report'],
            datasets: [
                {
                    data: [436, 338],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB"
                    ]
                }]
        };
        const dataforBarChart = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'T1 Report',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Rexa Report',
                    backgroundColor: '#9CCC65',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
        return (
			<div>
				<BaseTemplate />
                <div className="content-section introduction" style={{marginTop: "115px"}}>
                    <div className="feature-intro">
                        <h1>Statistics Dashboard</h1>
                    </div>
                </div>
                <div className="content-section implementation" style={{ marginTop: "115px", display: "flex", flexDirection: "row" }}>
                    <PieChart input={dataForPieChart} ></PieChart>
                    <BarChart input={dataforBarChart}></BarChart>
                </div>
				<StickyFooter />
			</div>
        );
    }
	
}

export default Homescreen;