import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import Pref from '../models/Pref';  
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';

class ColumnPreferenceDataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnData: props.data,
            columnHeader: props.columns,
            prefData : [],
        };
        this.fetchCheckBox = this.fetchCheckBox.bind(this); 
        this.updateRowData = this.updateRowData.bind(this);
        this.savePreferences = this.savePreferences.bind(this);
        this.sortTemplate = this.sortTemplate.bind(this);
        this.filterTemplate = this.filterTemplate.bind(this);
        this.hiddenTemplate = this.hiddenTemplate.bind(this);
        this.newWidthTemplate = this.newWidthTemplate.bind(this);
        this.onPropertyChange = this.onPropertyChange.bind(this);
    }

    componentWillMount() {        
        var preData = [];
        let index = 0;
        for(let column of this.props.data) {
            preData.push(new Pref(""+index, ""+column.field, ""+column.filter, ""+column.sortable, ""+column.hidden=="true"?true:false, column.width));
            index++;
        }    
        this.setState({
            prefData : preData
        })      
    }
    updateRowData(checked,rowData,column){
        if (column.header === 'sortable') {
            rowData.sortable =  checked;
        }
        else if (column.header === 'filter') {
                rowData.filter = checked;
            }
    }

    fetchCheckBox(rowData,column){
        if(column.header==='sortable'){
            return <Checkbox checked={rowData.sortable}></Checkbox>
        }else if(column.header==='filter'){
            return <Checkbox onChange={e => this.updateRowData( e.checked,rowData,column )} checked={rowData.filter}></Checkbox>
        }
    }


    savePreferences(){
		var preferences = JSON.stringify(this.state.prefData);
        console.log(preferences);
        var report_name = this.props.reportName;
        var group_name = this.props.groupName;	
        var user_name = sessionStorage.getItem('userName');
		var payload = {
			"report_name": report_name,
            "preferences": preferences,
            "user_name" : user_name
		}
		try { 
                axios.post("http://localhost:9000/preferences/insert", payload).then(function(response){
                    if (response.status === 200 && response.data.errorNum == undefined) {
                        alert("Preferences Saved");
                    }  
                    else {
                        alert("Error saving preferences");
                    }
                });
            }catch(error){
                console.log('Axios request failed: ${e}');
                alert('A technical error occured');
            }
    }

    sortTemplate(rowData, column) {
        return <div>
            <Checkbox id={rowData.index} inputId={rowData.index} value={rowData.index} onChange={(e) => this.onPropertyChange(e,"sort")} checked={rowData.sort == "true"}></Checkbox>
        </div>;
    }

    filterTemplate(rowData, column) {
        return <div>
            <Checkbox id={rowData.index} inputId={rowData.index} value={rowData.index} onChange={(e) => this.onPropertyChange(e,"filter")} checked={rowData.filter == "true"}></Checkbox>
        </div>;
    }
    
    hiddenTemplate(rowData, column) {
        return <div>
            <Checkbox id={rowData.index} inputId={rowData.index} value={rowData.index} onChange={(e) => this.onPropertyChange(e,"hidden")} checked={rowData.hidden == "true"}></Checkbox>
        </div>;
    }

    newWidthTemplate(rowData, column) {
        return <div>
            <InputText id={rowData.index} type="text" size={5} value={""+rowData.width} onInput={(e) => this.onPropertyChange(e,"width")} />
        </div>;
    }

    onPropertyChange(event, propertyName) {
        console.log(event, propertyName);
        let data = this.state.prefData;
        let colData = this.state.columnData;

        if(propertyName === "sort") {
            data[parseInt(event.value)].sort = String(event.checked);
        }

        else if(propertyName === "filter") {
            data[parseInt(event.value)].filter = String(event.checked);
        }
        else if(propertyName === "hidden") {
            data[parseInt(event.value)].hidden = String(event.checked);
        }
        else if(propertyName === "width") {
            data[parseInt(event.target.id)].width = String(event.target.value);
        }

        this.setState({
            prefData : data            
        })
    }

    render() { 
           
        return (
            <div>
                <div>
                <DataTable value={this.state.prefData} 
                    paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                    scrollHeight="330px" responsive={true} 
                    style={{ tableLayout: 'auto', fontSize: '12px', width: '95%', marginLeft: '20px' }}>
                        <Column key="index" field="index" header="Position" filter={false} reponsive={true} sortable={false}/>
                        <Column key="columnName" field="columnName" header="columnName" style={{fontWeight : 'bold'}}  filter={false} responsive={true} sortable={false} />
                        <Column key="sort" field="sort" header="Sort" body={this.sortTemplate} filter={false} responsive={true} sortable={false} />
                        <Column key="filter" field="filter" header="Filter" body={this.filterTemplate}  filter={false} responsive={true} sortable={false} />
                        <Column key="hidden" field="hidden" header="Hidden" body={this.hiddenTemplate} filter={false} responsive={true} sortable={false} />
                        <Column key="width" field="width" header="Width" body={this.newWidthTemplate} filter={false} responsive={true} sortable={false} />

                    </DataTable>
                </div>     
                <Button label="Save Preferences" className="p-button-raised" onClick={this.savePreferences}  />
            </div>
        );
    }
}

export default ColumnPreferenceDataGrid;