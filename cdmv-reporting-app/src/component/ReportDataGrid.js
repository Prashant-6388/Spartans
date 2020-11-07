import React, { Component } from 'react';
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ExportCSV } from './ExportCSV';
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';

class ReportDataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            cols: props.cols,
            colOptions: props.colOptions,
            colOptionsValue: props.colOptionsValue,
            prefChagned : false
        };

        this.updateColumns = this.updateColumns.bind(this);
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.onColumnResizeEnd = this.onColumnResizeEnd.bind(this);
        this.onColReorder = this.onColReorder.bind(this);
        this.updateColumnWidth = this.updateColumnWidth.bind(this);
        this.updateColumnOrder = this.updateColumnOrder.bind(this);
        this.savePreferences = this.savePreferences.bind(this);
    }
    
    updateColumns(columns,colOptsVal) {
        this.setState({
            cols: columns,
            colOptionsValue: colOptsVal
        })
        for (let col of columns) {            
            this.state.colOptions.push({ label: col.field, value: col.field });
        }
    }

    onColumnToggle(event) {
        let newColumns = [];
        let newColOptsValue = [];
        console.log("toggle event called, "+event)
        let index = 0;
        for (let column of this.props.data.columns) {
            if (event.value.includes(column.field)){
                newColumns.push(column);
                newColOptsValue.push(column.field);
            }
            else {
                this.props.columnArray[index].hidden = true;
                this.setState({
                    prefChagned : true
                })
            }
            index ++;
        }
        this.setState(
            { 
                cols: newColumns ,
                colOptionsValue: newColOptsValue,
            }
        );
    }

    componentWillMount() {        
        var self = this;         
    }
	
	onColReorder(event){
        console.log("Column reordered");
        console.log(event);
        this.updateColumnOrder(event.dragIndex, event.dropIndex)
        this.setState({
            prefChagned : true
        })
    }
  
    onColumnResizeEnd(event){
        console.log("Column size changed");
        console.log(event);
        this.updateColumnWidth(event.column.field, event.delta);
        this.setState({
            prefChagned : true
        })
    }

    updateColumnWidth(fieldName, delta) {
        for(let column of this.props.columnArray) {
            if(column.field == fieldName) {
                column.width = parseInt(column.width) + parseInt(delta);
                break;
            }
        }
    }

    updateColumnOrder(currentIndex, newIndex){
		var temp = this.props.columnArray[newIndex];
		this.props.columnArray[newIndex] = this.props.columnArray[currentIndex];
		this.props.columnArray[currentIndex] = temp;
	
    }
	
	savePreferences(){
		var preferences = JSON.stringify(this.props.columnArray);
        console.log(preferences);
        var report_name = this.props.reportname;		
        var user_name = this.props.username;
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
	    
    render() {
        var header = 
        <div style={{ textAlign: 'left' }}>
            <ExportCSV csvData={this.props.data.columnData} fileName={this.props.fileName} /> 
            <div style={{ textAlign: 'left', display: 'inline-flex', width: '180px', padding: '0px 5px' }}>
                    <MultiSelect value={this.state.colOptionsValue} options={this.state.colOptions} onChange={this.onColumnToggle} style={{ width: '250px' }} />
            </div>
        </div>;
        let columns = this.state.cols.map((col) => {
            return <Column key={col.field} field={col.field} header={col.header}
                filter={col.filter} responsive={true}
                style={{ width: col.width+'px' }} sortable={col.sortable} />;
        });
        return (
            <div>
                <div>
                    <DataTable value={this.props.data.columnData} header={header}
                        paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} scrollable={true}
                        scrollHeight="330px" responsive={true} resizableColumns={true} reorderableColumns={true} 
                        style={{ tableLayout: 'auto', fontSize: '12px', width: '95%', marginLeft: '20px' }}
						onColReorder={this.onColReorder} onColumnResizeEnd={this.onColumnResizeEnd} 
                        stateKey="ReportGrid" stateStorage="local">
                        {columns} 
                        
                    </DataTable>
                    {this.state.prefChagned && <Button label="Save Preferences" className="p-button-raised" onClick={this.savePreferences}  /> }
                </div>
            </div>
        );
    }    
}

export default ReportDataGrid;