import React from 'react';
import ComboBox from '../component/ComboBox';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';

class AddReportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem('userName'),
            datasources: [],
            selectedDS: "Select DataSource",
            submitDisabled: true,
            reportName: "",
            reportQuery: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }


    componentWillMount() {
        var self = this;                
        axios.get("http://localhost:9000/config/selectAll").then(function (response) {
            if (response.status === 200 && response.data.errorNum == undefined) {
                console.log('fetch db config service reponse: ' + response.data);                
                let responseData = response.data;
                var defaultOption = { name: 'Select DataSource', code: 'Select DataSource'};                
                self.state.datasources.push(defaultOption);
                console.log('response data length: ' + responseData.data.length);
                if (Array.isArray(responseData.data.rows) && responseData.data.rows.length) {
                    for(let i=0; i< responseData.data.rows.length;i++){
                        var option = {};                        
                        var optValue = responseData.data.rows[i][3] === null ? responseData.data.rows[i][6] : responseData.data.rows[i][3];
                        option['name'] = optValue + ":" + responseData.data.rows[i][4];
                        option['code'] = responseData.data.rows[i][8];
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

    handleSelection(event) {        
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

    handleSubmit(event) {
        const data = new FormData(event.target);
        let colOptsValue = [];
        

        event.preventDefault();
    }

    render() {
        return (
            <div style={{ marginTop: '150px' }}>
                <BaseTemplate />
                <form onSubmit={this.handleSubmit} style={{ padding: '10px' }}>
                    <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Report Name: </label>
                    <InputText name="reportname" value={this.state.reportname} style={{ display: 'inline-flex' }} /> <br/> <br/>
                    <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Data Source: </label>
                    <ComboBox name="dataSource" value={this.state.selectedDS} options={this.state.datasources} onChange={this.handleSelection} /> <br/><br/>
                    <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Query: </label>
                    <InputTextarea rows={10} cols={60} value={this.state.reportQuery} onChange={(e) => this.setState({ reportQuery: e.target.value })} /> <br /> <br/>
                    <label style={{ marginTop: '5px', paddingLeft: '45px', paddingRight: '10px' }}></label>
                    <Button label="Submit" className="p-button-raised" disabled={this.state.submitDisabled} />
                </form>  
                <StickyFooter />              
            </div>
        );
    }
}

export default AddReportForm;