import React, { Component } from 'react';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';
import IBMReportForm from '../form/ReportForm';
import ibmReportData from '../json/IBMReportNew.json';

class IBMReport extends Component {
    render() {
        const statuses = [
            { name: 'Proof Of Delivery', code: '14' }
          ];
        return (
			<div style={{marginTop:'115px'}}>                
				<BaseTemplate />
                <IBMReportForm fileName="IBMReport" jsonData={ibmReportData}  statuses={statuses} 
                    dateCol="UPS Received Date" statusCol="Carton Status"/>
				<StickyFooter />
			</div>
        );
    }
	
}

export default IBMReport;