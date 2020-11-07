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

class ManageReport extends Component {
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
            modifiedReportName: ""
        };
        this.editReport = this.editReport.bind(this);
        this.processResponse = this.processResponse.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.saveReport = this.saveReport.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDsSelection = this.handleDsSelection.bind(this);
        this.deleteReport = this.deleteReport.bind(this);
    }

    componentWillMount() {
        var self = this;
        axios.get("http://localhost:9000/config/selectAll").then(function (response) {
            if (response.status === 200 && response.data.errorNum == undefined) {
                console.log('fetch db config service reponse: ' + response.data);
                let responseData = response.data;                                
                if (Array.isArray(responseData.data.rows) && responseData.data.rows.length) {
                    for (let i = 0; i < responseData.data.rows.length; i++) {
                        var option = {};
                        var optValue = responseData.data.rows[i][3] === null ? responseData.data.rows[i][5] : responseData.data.rows[i][3];
                        option['name'] = optValue + ":" + responseData.data.rows[i][4];
                        option['code'] = responseData.data.rows[i][6];
                        self.state.datasources.push(option);
                    }
                } else {
                    alert('No data sources available. Please create a data source');

                }
            }
            else if (response.data.code === 204) {
                alert('Unable to retrieve data sources');
            }
            else {
                alert('an error occurred while retrieving data sources');
            }
        });

    }

    handleDsSelection(event) {
        this.setState({
            selectedDS: event.value
        });
        if (event.value != 'Select Datasource') {
            this.setState({
                submitDisabled: false
            })
        } else {
            this.setState({
                submitDisabled: true
            })
        }
    }

    handleDialogOpen () {
        this.setState({open: true, dialogTitle: "Add Report", action: "add"});
    };

    handleDialogClose  () {
        this.setState({ open: false });
    };

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={(event) => this.editReport(rowData)}></Button>&nbsp;
            <Button type="button" icon="pi pi-trash" className="p-button-failure" onClick={(event) => { if (window.confirm('Are you sure you want to delete?')) { this.deleteReport(rowData) }; }}></Button>
        </div>;
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

        let columns_new = columns.map((col) => {            
            return <Column key={col.field} field={col.field} header={col.header}
                filter={col.filter} responsive={true}
                style={{ width: col.width + 'px' }} sortable={col.sortable} />;
        });

        this.setState({
            cols: columns_new,
            data: rawRowData,
            displayGrid: true
        });
    }

    editReport(rowData) {  
        var editedReportDS = {};
        for(let i=0;i< this.state.datasources.length;i++){
            if(rowData.DATASOURCE === this.state.datasources[i].name)
            editedReportDS = this.state.datasources[i];
        }
        
        try {         
            var payload = {
                "reportName": rowData.REPORT_NAME
            };
            var self =this;
            axios.post("http://localhost:9000/report/fetchReportQuery", payload).then(function (response) {
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        self.setState({
                            reportName: rowData.REPORT_NAME,
                            modifiedReportName: rowData.REPORT_NAME,
                            selectedDS: editedReportDS,
                            reportQuery: response.data.data[0][0],
                            open: true,
                            dialogTitle: "Edit Report",
                            action: "update"
                        });
                    }
                    else {
                        alert("Error fetching query for edit");
                    }
                });
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }             
    }

    deleteReport(rowData){
        try {
            var payload = {
                "reportName": rowData.REPORT_NAME
            };
            var self = this;
            axios.post("http://localhost:9000/report/delete", payload).then(function (response) {
                if (response.status === 200 && response.data.errorNum === undefined) {
                    alert("Selected report deleted");
                    window.location.reload(false);
                }
                else {
                    alert("Error in deleting report");
                }
            });
        } catch (error) {
            console.log('Axios request failed: ${error}');
            alert('A technical error occured');
        }
    }

    saveReport() {

        var payload = {
            "reportName": this.state.reportName==="" ? this.state.modifiedReportName:this.state.reportName,
            "dbConfigId": this.state.selectedDS.code,
            "reportQuery": this.state.reportQuery,
            "modifiedReportName": this.state.modifiedReportName
        }
        try {
            if (!this.state.modifiedReportName || !this.state.selectedDS.code || this.state.reportQuery){
                alert('All the fields are mandatory');
            }else 
            if (this.state.action == "add") {
                axios.post("http://localhost:9000/report/save", payload).then(function (response) {
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        alert("Report details inserted");
                    }
                    else {
                        alert("Error saving Report details");
                    }
                });
                window.location.reload(false);
            }
            else {
                axios.post("http://localhost:9000/report/update", payload).then(function (response) {
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        alert("report details Updated");
                    }
                    else {
                        alert("Error updating Config details");
                    }
                });
                window.location.reload(false);
            }
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }
    };

    render() {        
        return (
            <div style={{ marginTop: '150px' }}>
                <BaseTemplate />
                {this.state.displayGrid && <DataTable value={this.state.data}
                    paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                    scrollHeight="300px" responsive={true} resizableColumns={true} reorderableColumns={true}
                    style={{ tableLayout: 'auto', fontSize: '12px', width: '95%', marginLeft: '20px' }}
                    stateKey="DBConfigGrid" stateStorage="local">
                    {this.state.cols}
                    <Column header="Action" responsive={true}
                        body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
                }
                <div style={{ display: 'flex', marginLeft: '20px', marginTop: '10px' }}>
                    <Button type="button" icon="pi pi-plus" className="p-button-success" onClick={this.handleDialogOpen}></Button>&nbsp;
                 </div>                

                <Dialog open={this.state.open} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>                        
                        <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Report Name: </label>
                        <InputText name="reportname" value={this.state.modifiedReportName} style={{ display: 'inline-flex' }} onChange={(e) => this.setState({ modifiedReportName: e.target.value })}/> <br /> <br />
                        <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Data Source: </label>
                        <ComboBox placeHolder="Select Datasource" name="dataSource" value={this.state.selectedDS} options={this.state.datasources} onChange={this.handleDsSelection} /> <br /><br />
                        <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Query: </label>
                        <InputTextarea rows={10} cols={60} value={this.state.reportQuery} onChange={(e) => this.setState({ reportQuery: e.target.value })} /> <br /> <br />
                    </DialogContent>
                    <DialogActions>
                        <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-info" onClick={this.handleDialogClose} />                            
                        <Button label="Save" type="button" icon="pi pi-save" className="p-button-info" onClick={this.saveReport} />
                    </DialogActions>
                </Dialog>
                <StickyFooter />
            </div>
        );
    }
}

export default ManageReport;