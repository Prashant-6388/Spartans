import React, { Component } from 'react';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';
import T1ReportForm from '../form/ReportForm';

class T1Reportscreen extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const statuses = [{ name: 'NIST', code: 'NIST' },
            { name: 'SDC', code: 'SDC' }, { name: 'SRCL', code: 'SRCL' }];
        return (
            <div style={{marginTop:'115px'}}>
                <BaseTemplate />
                <T1ReportForm fileName="T1Report" reportName="T1Report" statuses={statuses} dateCol="dateCleared" statusCol="t1Status"/>                
                <StickyFooter />
            </div>
        );
    }

}

export default T1Reportscreen;