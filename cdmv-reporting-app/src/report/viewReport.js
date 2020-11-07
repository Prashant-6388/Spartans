import React, { Component } from 'react';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';
import ReportForm from '../form/ReportForm';

class ViewReport extends Component {    
    componentDidMount(props) {
        console.log("property_id", this.props.location.state.reportName);
    }
    
    render() {                
        var statuses = [
            { name: 'CLD', code: 'CLD' },
            { name: 'HLD', code: 'HLD' },
            { name: 'RST', code: 'RST' },
            { name: 'APR', code: 'APR' },
            { name: 'RJT', code: 'RJT' }
          ];     
        if (this.props.location.state.reportName === 'T1Report') {
            statuses = [{ name: 'NIST', code: 'NIST' },
            { name: 'SDC', code: 'SDC' }, { name: 'SRCL', code: 'SRCL' }];
        }  
        return (
			<div style={{marginTop:'115px'}}>                
				<BaseTemplate />
                <ReportForm fileName="RexaReport" reportName={this.props.location.state.reportName} statuses={statuses} dateCol="DateCleared" statusCol= "RequestStatus"
                displayStatus={this.props.location.state.displayStatus}/>
				<StickyFooter />
			</div>
        );
    }
	
}

export default ViewReport;