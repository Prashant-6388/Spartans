import React from 'react';
import ComboBox from '../component/ComboBox';
import { Button } from 'primereact/button';
import AccessManagementDataGrid from '../component/AccessManagementDataGrid';
import accessManagementData from '../json/accessManagement.json';

class AccessManagementForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem('userName'),
            groupNames: props.groupNames,
            selectedGroup: "Select Group",
            displayData: false,
            submitDisabled: true,
            originalData: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSelection(event) {
        this.setState({
            selectedGroup: event.value
        })
        if (event.value != 'Select Group') {
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
        this.state.originalData = accessManagementData;
        console.log("Original Data length: " + this.state.originalData.length);     

        this.setState({
            cols: this.state.originalData.columns,
            displayData: true
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} style={{ padding: '10px', display: 'inline-flex' }}>
                    <label style={{ marginTop: '5px', paddingLeft: '10px', paddingRight: '10px' }} >Groups: </label>
                    <ComboBox name="groupName" value={this.state.selectedGroup} options={this.state.groupNames} onChange={this.handleSelection} />&nbsp;                
                    <label style={{ marginTop: '5px', paddingLeft: '45px', paddingRight: '10px' }}></label>
                    <Button label="Submit" className="p-button-raised" disabled={this.state.submitDisabled} />
                </form>
                {this.state.displayData && <AccessManagementDataGrid data={this.state.originalData} cols={this.state.cols}
                     username={this.state.username} />}
            </div>
        );
    }
}

export default AccessManagementForm;