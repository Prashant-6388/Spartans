import React, { Component } from 'react';
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import rexaReportData from '../json/rexaReportData.json';
import ColumnPreferenceDataGrid from '../component/ColumnPreferenceDataGrid';

class AccessManagementDataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            cols: props.cols,
            columnData: [],
            editClicked: false,
            columnHeader: [],
            columnPreferencsCols: [],
            reportName : "",
            groupName : "",
            applicationName : ""
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
        
    handleClick(rowData){
        var selectedReportName= rowData.PageAccess;    
        var selectedGroupName = rowData.GroupName; 
        let columnHeader = [];
        columnHeader.push(JSON.parse("{ \"name\": \"field\" }"));
        columnHeader.push(JSON.parse("{ \"name\": \"header\" }"));  
        columnHeader.push(JSON.parse("{ \"name\": \"sortable\" }"));  
        columnHeader.push(JSON.parse("{ \"name\": \"filter\" }"));  
        columnHeader.push(JSON.parse("{ \"name\": \"width\" }"));
        
        this.setState ({
            editClicked: true,
            columnData: rexaReportData.columns ,
            columnPreferencsCols: columnHeader,
            reportName : selectedReportName,
            groupName : selectedGroupName            
        });
    }

    actionTemplate(rowData, column) {
        if (rowData.PageAccess == 'Home' || rowData.PageAccess =='Aboutus'){
            return <div>                
                <Button type="button" icon="pi pi-trash" className="p-button-failure"></Button>
            </div>; 
        }

        return <div>           
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={(event) => this.handleClick(rowData)}></Button>&nbsp;
            <Button type="button" icon="pi pi-trash" className="p-button-failure"></Button>
        </div>;
    }

    render() {
        let columns = this.state.cols.map((col) => {
            return <Column key={col.field} field={col.field} header={col.header}
                filter={col.filter} responsive={true}
                style={{ width: col.width+'px' }} sortable={col.sortable} />;
        });
        return (
            <div>
                <div>
                    <DataTable value={this.props.data.columnData} 
                        paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                        scrollHeight="300px" responsive={true} resizableColumns={true} reorderableColumns={true} 
                        style={{ tableLayout: 'auto', fontSize: '12px', width: '95%', marginLeft: '20px' }}						
                        stateKey="AccessManagementGrid" stateStorage="local">
                        {columns} 
                        <Column header="Action" responsive={true}
                            body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />                   
                    </DataTable>
                    <br />
                    <br />
                    {this.state.editClicked && <ColumnPreferenceDataGrid data={this.state.columnData} reportName={this.state.reportName}
                    groupName={this.state.groupName} columns={this.state.columnPreferencsCols}/>}
                </div>                
            </div>
        );
    }    
}

export default AccessManagementDataGrid;