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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { InputText } from 'primereact/inputtext'; 
import { MultiSelect } from 'primereact/multiselect';


class UserRoleConfig extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            cols: [],
            data: [],
            displayGrid : false,
            visible : false,
            configData : [],
            action: "",
            dialogTitle: "",
            open: false,
            username : "",
            groupname : "",
            submitDisabled : false,
            roles: [],
            openAdd : false,
            newRole : "",
            selectedRoles : []
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.processResponse = this.processResponse.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.saveGroup = this.saveGroup.bind(this);
        this.handleRoleSelection = this.handleRoleSelection.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.openAddDialog = this.openAddDialog.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }
        
    actionTemplate(rowData, column) {
        return <div>           
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={(event) => this.handleClick(rowData)}></Button>&nbsp;
            <Button type="button" icon="pi pi-trash" className="p-button-failure" onClick={(event) => this.handleDeleteClick(rowData)}></Button>
        </div>;
	}
    
    componentDidMount() {
        try { 
            var payload = {};
            let columnData = [];
            console.log("getting config data");
            axios.get("http://localhost:9000/groupConfig/selectAll").then(function(response){
                let responseData = response.data;
                console.log("getting config response");
                if (response.status === 200 && response.data.errorNum == undefined) {
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
                style={{ width: col.width+'px' }} sortable={col.sortable} />;
        });

        this.setState({
            cols : columns_new,
            data : rawRowData,
            displayGrid : true
        });
    }

    handleDeleteClick(rowData) {  
        try {
            var payload = {
                groupname : rowData.GROUP_NAME
            }
            axios.post("http://localhost:9000/groupConfig/deleteGroup",payload).then(function (response) {
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        alert("User deleted....");
                        window.location.reload(true);
                    }
                    else {
                        alert("Error deleting user");
                    }
                }.bind(this));
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }         
    }

    handleClick(rowData) {  
        try {
            axios.get("http://localhost:9000/groupConfig/selectAllReports").then(function (response) {
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        let responseData = response.data;
                        let options = [];
                        for (let i = 0; i < responseData.data.rows.length; i++) {
                            var option = {};
                            var optValue = responseData.data.rows[i][0];
                            option['label'] = optValue;
                            option['value'] = optValue;
                            options.push(option);
                            if(rowData.REPORTS !=null && rowData.REPORTS.indexOf(optValue) !== -1){
                                this.state.selectedRoles.push(optValue);
                            }
                        }

                        this.setState({
                            dialogTitle: "Edit Group",
                            action: "edit",
                            open: true,
                            groupname : rowData.GROUP_NAME,
                            roles : options
                        });
                    }
                    else {
                        alert("Error fetching query for groups");
                    }
                }.bind(this));
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        }         
    }

    openAddDialog() {
        try {
            axios.get("http://localhost:9000/groupConfig/selectAllReports").then(function (response) {
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        let responseData = response.data;
                        let options = [];
                        for (let i = 0; i < responseData.data.rows.length; i++) {
                            var option = {};
                            var optValue = responseData.data.rows[i][0];
                            option['label'] = optValue;
                            option['value'] = optValue;
                            options.push(option);
                        }

                        this.setState({
                            dialogTitle: "Add Group",
                            action: "add",
                            openAdd: true,
                            roles : options
                        });
                    }
                    else {
                        alert("Error fetching query for groups");
                    }
                }.bind(this));
        } catch (error) {
            console.log('Axios request failed: ${e}');
            alert('A technical error occured');
        } 
    }

    handleDialogOpen () {
        this.setState({open: true, dialogTitle: "Add Role", action: "add"});
    };

    handleDialogClose  () {
        this.setState({ open: false, openAdd : false });
    };

    handleRoleSelection(event) {
        console.log("handleRoleSelection called....");
        this.setState({
            selectedRoles: event.value
        });
        if (event.value != 'Select Role') {
            this.setState({
                submitDisabled: false
            })
        } else {
            this.setState({
                submitDisabled: true
            })
        }
    }

    saveGroup(action) {
        console.log("saving data..."+action);
        if(action==="add") {
            console.log("adding new role : "+this.state.newRole + " ,for user:"+this.state.username+" and group : "+this.state.groupname);
            var payload = {
                "groupname" : this.state.groupname,
                "roles" : this.state.selectedRoles
            }
          
            try { 
                axios.post("http://localhost:9000/groupConfig/insertGroup", payload).then(function(response){
                    if (response.status === 200 && response.data.errorNum === undefined) {
                        alert("Group added successfully");
                        window.location.reload(true);
                    }  
                    else {
                        alert("Error inserting group");
                    }
                });
                
            }
            catch(error) {
                console.log('Axios request failed: ${e}');
                alert('A technical error occured');
            }
        }
        else {
            console.log("Updating role : "+this.state.selectedRoles + " ,for group:"+this.state.groupname);
            var payload = {
                "groupname" : this.state.groupname,
                "roles" : this.state.selectedRoles
            }
          
            try { 
                axios.post("http://localhost:9000/groupConfig/updateGroupRoles", payload).then(function(response){
                    if (response.status === 200 && response.data.errorNum === undefined) {
                        alert("User Role updated successfully");
                        window.location.reload(true);
                    }  
                    else {
                        alert("Error updating user role");
                    }
                });
                
            }
            catch(error) {
                console.log('Axios request failed: ${e}');
                alert('A technical error occured');
            }
        }
    }

    render() {
        return (
            <div style={{ marginTop: '150px' }}>
                <BaseTemplate />
                { this.state.displayGrid && <DataTable value={this.state.data} 
                        paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                        scrollHeight="300px" responsive={true} resizableColumns={true} reorderableColumns={true} 
                        style={{ tableLayout: 'auto', fontSize: '12px', width: '95%', marginLeft: '20px' }}						
                        stateKey="DBConfigGrid" stateStorage="local">
                        {this.state.cols} 
                        <Column header="Action" responsive={true}
                            body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />                   
                    </DataTable>
                 }

                <Button type="button" icon="pi pi-plus" label="Add Group" className="p-button-success" onClick={(event) => this.openAddDialog()}></Button>&nbsp;
                
                
                <Dialog open={this.state.open} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent style={{height: "300px"}}>                        
                        <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Group: </label>
                        <InputText name="groupname" value={this.state.groupname} disabled={true} style={{ display: 'inline-flex' }} /> <br /> <br />
                        <MultiSelect placeHolder="Select Report" name="repots" value={this.state.selectedRoles} options={this.state.roles} onChange={this.handleRoleSelection} /> <br /><br />
                    </DialogContent>
                    <DialogActions>
                        <Button label="Cancel" name="cancel" type="button" icon="pi pi-times" className="p-button-info" onClick={this.handleDialogClose} />                            
                        <Button label="Save" name="save" type="button" icon="pi pi-save" className="p-button-info" onClick={(event) => this.saveGroup("edit")} />
                    </DialogActions>
                </Dialog>
                
                <Dialog open={this.state.openAdd} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent style={{height: "300px"}}>                        
                        <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Group: </label>
                        <InputText name="groupname" value={this.state.groupname} disabled={false} style={{ display: 'inline-flex' }} onChange={(e) => {this.setState({ groupname : e.target.value})}} /> <br /> <br />
                        <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >New Role: </label>
                        <MultiSelect placeHolder="Select Report" name="repots" value={this.state.selectedRoles} options={this.state.roles} onChange={this.handleRoleSelection} /> <br /><br />
                    </DialogContent>
                    <DialogActions>
                        <Button label="Cancel" name="cancel" type="button" icon="pi pi-times" className="p-button-info" onClick={this.handleDialogClose} />                            
                        <Button label="Add" name="add" type="button" icon="pi pi-save" className="p-button-info" onClick={(event) => this.saveGroup("add")} />
                    </DialogActions>
                </Dialog>
                <StickyFooter />      
            </div>
        );
    }    
}

export default UserRoleConfig;