import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import ComboBox from '../component/ComboBox';
import axios from 'axios';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';
import DBConfigForm from '../component/DBConfigForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

class ReportList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cols: [],
            data: [],
            displayGrid: false,
            datasources: [],
            action: "",
            dialogTitle: "",
            open: false,
            selectedDS: "",
            submitDisabled: true,
            reportName: "",
            reportQuery: "",
            redirectToReferrer: false,
            open: false
        };
        this.viewReport = this.viewReport.bind(this);
        this.processResponse = this.processResponse.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
    }

   
    componentDidMount() {
        try {
            var payload = {};
            let columnData = [];
            console.log("getting report data");
            axios.get("http://localhost:9000/report/allReportDetails").then(function (response) {
                let responseData = response.data;
                console.log("getting report details response");
                if (response.status === 200 && response.data.errorNum == undefined) {
                    console.log("got response : " + responseData.data);
                    this.processResponse(responseData.data.metaData, responseData.data.rows);
                }
                else {
                    alert("Error saving preferences");
                }
            }.bind(this));
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }
    }

    processResponse(metaData, rows) {
        //parse Metadata for columns
        var columns = [];
        for (let i = 0; i < metaData.length; i++) {
            var columnPreference = {};
            columnPreference['field'] = metaData[i].name;
            columnPreference['header'] = metaData[i].name;
            columnPreference['sortable'] = true;
            columnPreference['filter'] = false;
            columnPreference['width'] = 100;
            columns.push(columnPreference);
        }

        var rawRowData = []
        for (let i = 0; i < rows.length; i++) {
            var rawRow = {};
            let row = rows[i];
            for (let j = 0; j < row.length; j++) {
                rawRow[metaData[j].name] = row[j];
            }
            rawRowData.push(rawRow)
        }

        this.setState({
            data: rawRowData,
            displayGrid: true
        });
    }

    viewReport(rowData) {       

        try {            
            var payload = {
                "reportName": rowData.REPORT_NAME
            };
            var self = this;
            self.setState({ open: true });
            axios.post("http://localhost:9000/report/fetchReportQuery", payload).then(function (response) {
                if (response.status === 200 && response.data.errorNum == undefined) {
                    self.setState({
                        reportName: rowData.REPORT_NAME,
                        redirectToReferrer: true
                    });
                }
                else {
                    alert("Error fetching query for edit");
                }
            }).finally(function () {
                self.setState({ open: false });
            });
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-sign-in" className="p-button-success" onClick={(event) => this.viewReport(rowData)}></Button>
        </div>;
    }

    render() {
        const { classes } = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/viewReport' } }
        const { redirectToReferrer } = this.state
        if (redirectToReferrer === true && (this.state.reportName == 'T1Report' || this.state.reportName =='ReExportation')) {
            return <Redirect to={{
                pathname: '/viewReport', state: {
                    reportName: this.state.reportName, 
                    displayStatus: true} }} />
        } else if (redirectToReferrer === true){
            return <Redirect to={{
                pathname: '/viewReport', state: {
                    reportName: this.state.reportName,
                    displayStatus: false
                }
            }} />
        }
        return (
            <div style={{ marginTop: '150px' }}>
                <BaseTemplate />
                {this.state.displayGrid && <DataTable value={this.state.data}
                    paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                    scrollHeight="300px" responsive={true} resizableColumns={true} reorderableColumns={true}
                    style={{ tableLayout: 'auto', fontSize: '12px', width: '55%', marginLeft: '20px' }}
                    stateKey="DBConfigGrid" stateStorage="local">
                    <Column key="REPORT_NAME" field="REPORT_NAME" header="REPORT_NAME"
                        filter={true} responsive={true}
                        style={{ width: '200px' }} sortable={true} />
                    <Column header="Action" responsive={true}
                        body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
                } 
                <Dialog open={this.state.open}>
                    <DialogContent
                        disableBackdropClick
                        disableEscapeKeyDown>
                        <CircularProgress />
                    </DialogContent>
                </Dialog>               
                <StickyFooter />
            </div>
        );
    }
}

export default ReportList;