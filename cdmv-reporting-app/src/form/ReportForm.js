import React from 'react';
import SimpleDatePicker from '../component/SimpleDatePicker';
import ComboBox from '../component/ComboBox';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import ReportDataGrid from '../component/ReportDataGrid';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
import { SelectField } from 'material-ui';

let ColumnPreference = require('../models/ColumnPreference').default;

class ReportForm extends React.Component {
    constructor(props) {
        super(props);
      this.state = {
        fileName: props.fileName,
        username: sessionStorage.getItem('userName'),
        from: new Date(),
        to: new Date(),
        statuses: props.statuses,
        status: 'Select Status',
        displayData: false,
        submitDisabled: true,
        originalData: {},
        filteredData: {},
        reportName: props.reportName,
        cols: [],
        colOptions: [],
        colOptionsValue: [],
        columnArray : [],
        open: false,
        displayStatus: props.displayStatus
      };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleToDateChange = this.handleToDateChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
      }
  

      handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
          })
      }

      handleSelection(event){
        this.setState({
          status : event.value
        })
        if (event.value != 'Select Status') {
          this.setState({
            submitDisabled : false
          })
        }else{
          this.setState({
            submitDisabled: true
          })
        }
      }

      handleDateChange(date) {
        console.log("From date = "+date.value);
        this.setState({from: date.value});
      }

      handleToDateChange(date) {
        console.log("To date = "+date.value);
        this.setState({to: date.value});
      }
    
      handleSubmit(event) { 
        var searchParams = [];
        var self = this; 
        var username = sessionStorage.getItem('userName');      
        if (this.state.reportName === 'T1Report' || this.state.reportName === 'ReExportation') {
        var status = event.target[2].value;
        var fromDate = event.target[3].value;
        var toDate = event.target[7].value;
        var dateSplit = fromDate.split('/');
        fromDate = dateSplit[2] + dateSplit[0] + dateSplit[1];
        dateSplit = toDate.split('/');
        toDate = dateSplit[2] + dateSplit[0] + dateSplit[1] ;        
        searchParams = [status, fromDate,toDate];  
        if (this.state.reportName === 'T1Report') 
          searchParams = [fromDate, toDate];     
        } else{
          for(let i=0; i< event.target.length; i++){
            if(event.target[i].value !=='' && event.target[i].value !==username){
              searchParams.push(event.target[i].value);
            }
          }
        }
        
        var payload = { reportName: this.state.reportName, queryParams: searchParams, userName: username};
        var fetchReportApiUrl = "http://localhost:9000/report/fetchReport";
        self.setState({ open: true });
        axios.post(fetchReportApiUrl, payload).then(function (response) {
          if (response.status === 200) {
            console.log('fetch report service reponse: ' + response.data);
            let colOptsValue = [];
            let columnData = [];
            let responseData = response.data;
            console.log('response data length: ' + responseData.data.length);
            if (Array.isArray(responseData.data) && responseData.data.length) {
              for (let i = 0; i < responseData.data.length; i++) {
                let rowData = {};
                let rowInfo = responseData.data[i];
                if(Array.isArray(rowInfo)){
                  for (let j = 0; j < rowInfo.length; j++) {
                    rowData[responseData.columns[j].name] = rowInfo[j];
                  }
                  columnData.push(rowData);
                }else{
                  columnData.push(rowInfo);
                }
                
				
              }
              console.log('ColumnData: ' + columnData);              
              var columns = [];
              if(responseData.columnPreference!=null && responseData.columnPreference.length!==0){
                /* self.state.columns = responseData.columnPreference; */
                columns = responseData.columnPreference;
              }else{                
                for(let i=0;i<responseData.columns.length;i++){
                  var columnPreference = {};
                  columnPreference['field'] = responseData.columns[i].name;
                  columnPreference['header'] = responseData.columns[i].name;
                  columnPreference['sortable'] = true;
                  columnPreference['filter'] = true;                  
                  columnPreference['width'] = 200;
                  columns.push(columnPreference);
                }               
              }
              self.state.filteredData.columnData = columnData;
              self.state.filteredData.columns = columns;
              for (let column of self.state.filteredData.columns) {
                colOptsValue.push(column.field);
				        self.state.columnArray.push(new ColumnPreference(column.field,column.header,column.sortable,column.filter,column.width,false));
              }              
              
              for (let col of self.state.filteredData.columns) {
                self.state.colOptions.push({ label: col.field, value: col.field });
              }
              self.setState({
                cols: self.state.filteredData.columns,
                colOptionsValue: colOptsValue,
                displayData: true
              });
            } else {
              alert('No data available for current report');
              self.setState({
                filteredData : {}
              });
            }
          }
          else if (response.data.code === 204) {
            alert('Unable to retrieve report data');
          }
          else {
            alert('an error occurred while retrieving report data');
          }
        }).catch(ex => {
          console.log("An error occurred while fetching report details");
          alert("A technical error occurred");
        }).finally(function(){
          self.setState({ open: false });
        });
        event.preventDefault();  
      }
    
      render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}  style={{ padding: '10px', display: 'inline-flex' }}>
                <label style={{marginTop: '5px', paddingLeft: '10px', paddingRight: '10px'}}>Name:</label>
                <InputText name="username" value={this.state.username} disabled={true} style={{ display : 'inline-flex' }} />
              {this.state.displayStatus && <label style={{marginTop: '5px', paddingLeft: '10px', paddingRight: '10px'}} >Status: </label>}
              {this.state.displayStatus && <ComboBox name="status" value={this.state.status} options={this.state.statuses} onChange={this.handleSelection} />} &nbsp; 
              {this.state.displayStatus &&  <label style={{marginTop: '5px', paddingLeft: '10px', paddingRight: '10px'}}>From:</label> }
              {this.state.displayStatus &&  <SimpleDatePicker id="from" name="from" value={this.state.from} handleDateChange={this.handleDateChange} />}
              {this.state.displayStatus &&  <label style={{marginTop: '5px', paddingLeft: '45px', paddingRight: '10px'}}>To:</label>}
              {this.state.displayStatus &&  <SimpleDatePicker id="to"   name="to"   value={this.state.to}   handleDateChange={this.handleToDateChange} />}
                <label style={{marginTop: '5px', paddingLeft: '45px', paddingRight: '10px'}}></label>         
                <Button label="Run" className="p-button-raised" disabled={this.state.displayStatus && this.state.submitDisabled}/>
            </form>
            {this.state.displayData && <ReportDataGrid data={this.state.filteredData} fileName={this.state.fileName} cols={this.state.cols} 
              colOptions={this.state.colOptions} colOptionsValue={this.state.colOptionsValue} columnArray={this.state.columnArray}
              username={this.state.username} reportname={this.props.reportName}/>}
            <Dialog open={this.state.open}>
              <DialogContent
                disableBackdropClick
                disableEscapeKeyDown>
                <CircularProgress />
              </DialogContent>
            </Dialog>                   
            </div>
        );
      }    
  }

  export default ReportForm;