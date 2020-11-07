import React, { Component } from 'react';
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import axios from 'axios';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';
import DBConfigForm from '../component/DBConfigForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { InputText } from 'primereact/inputtext';

class DBConfig extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            cols: [],
            data: [],
            displayGrid : false,
            displayDBConfigForm : false,
            visible : false,
            configData : [],
            action : ""
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.processResponse = this.processResponse.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.updateField = this.updateField.bind(this);
        this.saveDBConfig = this.saveDBConfig.bind(this);
        this.deleteConfig = this.deleteConfig.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }
        
    actionTemplate(rowData, column) {
        return <div>           
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={(event) => this.handleClick(rowData)}></Button>&nbsp;
            <Button type="button" icon="pi pi-trash" className="p-button-failure" onClick={(event) => {if(window.confirm('Are you sure you want to delete?')){this.deleteConfig(rowData)};}}></Button>           
        </div>;
	}
    
    componentDidMount() {
        try { 
            console.log("getting config data");
            axios.get("http://localhost:9000/config/selectAll").then(function(response){
                let responseData = response.data;
                console.log("getting config response");
                if (response.status === 200 && response.data.errorNum === undefined) {
                    console.log("got response : "+responseData.data);
                    this.processResponse(responseData.data.metaData, responseData.data.rows);
                }  
                else {
                    alert("Error saving preferences");
                }
            }.bind(this));
        }catch(error){
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }
    }

    processResponse(metaData, rows) {
        //parse Metadata for columns
        var columns = [];
        for(let i=0; i<metaData.length; i++){
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
            for(let j=0; j<row.length; j++){
                rawRow[metaData[j].name] = row[j];
            }
            rawRowData.push(rawRow)
        }
        
        let columns_new = columns.map((col) => {
            return <Column key={col.field} field={col.field} header={col.header}
                filter={col.filter} responsive={true}
                 sortable={col.sortable} width={col.width}/>;
        });

        this.setState({
            cols : columns_new,
            data : rawRowData,
            displayGrid : true
        });
    }

    handleClick(rowData){
        if(rowData === "add"){
            console.log("add method called after edit");
            this.setState({
                displayDBConfigForm : true,
                action : "add",
                configData : {}
            });
        }
        else{
            this.setState ({
                configData: Object.assign(this.state.configData, rowData),
                displayDBConfigForm : true,
                action : "update"
            });
        }
        
        console.log("state updated....");
    }

    deleteConfig(rowData){
        var payload = {
            "configId": rowData.ID
        };
        try {            
              axios.post("http://localhost:9000/config/delete", payload).then(function (response) {
                  if (response.status === 200 && response.data.errorNum === undefined) {
                      alert("Selected Config details deleted");
                      window.location.reload();
                  }
                  else {
                      alert("Error deleting Config details");
                  }
              });
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured while deleting the record');
        }
    }

    updateField(event){
        console.log("update Filed called....");
        var newConfig = this.state.configData;
        newConfig[event.target.name] = event.target.value;
        this.setState({
            configData : newConfig
        });
    }

    saveDBConfig() {
        console.log("saving data");
        console.log("type :"+this.state.configData.TYPE +", host:"+this.state.configData.HOST+", Port:"+this.state.configData.PORT);
        console.log("Service:"+this.state.configData.SERVICE+", username:"+this.state.configData.USERNAME);
        
        var payload = {
            "type" : this.state.configData.TYPE,
            "host" : this.state.configData.HOST,
            "port" : this.state.configData.PORT,
            "service" : this.state.configData.SERVICE,
            "username" : this.state.configData.USERNAME,
            "password" : this.state.configData.PASSWORD,
            "sid" : this.state.configData.SID
		}
		try { 
            if (!isNaN(this.state.configData.PORT)){
                if (this.state.action === "add") {
                    axios.post("http://localhost:9000/config/insert", payload).then(function (response) {
                        if (response.status === 200 && response.data.errorNum === undefined) {
                            alert("Config details inserted");
                        }
                        else {
                            alert("Error saving Config details");
                        }
                    });
                }
                else {
                    payload['id']=this.state.configData.ID;
                    axios.post("http://localhost:9000/config/update", payload).then(function (response) {
                        if (response.status === 200 && response.data.errorNum === undefined) {
                            alert("Config details Updated");
                        }
                        else {
                            alert("Error updating Config details");
                        }
                    });
                }
                window.location.reload();
            } else{
                alert("The PORT should contain only numbers");
            }
        } catch(error) {
            console.log('Axios request failed: ${error}'+error);
            alert('A technical error occured');
        }
    }

    handleDialogClose() {
        this.setState({ displayDBConfigForm: false });
    };

    render() {
        return (
            <div style={{ marginTop: '150px' }}>
                <BaseTemplate />
                { this.state.displayGrid && <DataTable value={this.state.data} 
                        paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                        scrollHeight="300px" responsive={true} resizableColumns={true} reorderableColumns={true} 
                        style={{ fontSize: '12px', width: '95%', marginLeft: '20px' }}						
                        stateKey="DBConfigGrid" stateStorage="local">
                        {this.state.cols} 
                        <Column header="Action" responsive={true}
                            body={this.actionTemplate} style={{ textAlign: 'center'}} />                   
                    </DataTable>
                 }
                 <div style={{ display: 'flex', marginLeft: '20px', marginTop: '10px' }}>
                    <Button type="button" icon="pi pi-plus" className="p-button-success" onClick={(event) => this.setState(this.handleClick("add"))}></Button>&nbsp;
                 </div>

                <Dialog open={this.state.displayDBConfigForm} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.state.action} config</DialogTitle>
                    <DialogContent>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Type</td>
                                    <td><InputText name="TYPE" value={this.state.configData.TYPE === undefined ? "" : this.state.configData.TYPE} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Host</td>
                                    <td><InputText name="HOST" value={this.state.configData.HOST === undefined ? "" : this.state.configData.HOST} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Port</td>
                                    <td><InputText name="PORT" value={this.state.configData.PORT === undefined ? "" : this.state.configData.PORT} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Service</td>
                                    <td><InputText name="SERVICE" value={this.state.configData.SERVICE === undefined ? "" : this.state.configData.SERVICE} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td><InputText name="USERNAME" value={this.state.configData.USERNAME === undefined ? "" : this.state.configData.USERNAME} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Password</td>
                                    <td><InputText name="PASSWORD" value={this.state.configData.PASSWORD === undefined ? "" : this.state.configData.PASSWORD} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                                <tr>
                                    <td>SID</td>
                                    <td><InputText name="SID" value={this.state.configData.SID === undefined ? "" : this.state.configData.SID} onChange={(e) => this.updateField(e)} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </DialogContent>
                    <DialogActions>
                        <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-info" onClick={this.handleDialogClose} />
                        <Button label="Save" type="button" icon="pi pi-save" className="p-button-info" onClick={this.saveDBConfig} />
                    </DialogActions>
                </Dialog>
                <StickyFooter />      
            </div>
        );
    }    
}

export default DBConfig;