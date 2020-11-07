import React from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';

class DBConfigForm extends React.Component{

    constructor(props){
        super(props);
        /*this.state = {
            type : this.props.rowData,
            host : this.props.rowData.HOST,
            port : this.props.rowData.PORT,
            service : this.props.rowData.SERVICE,
            username : this.props.rowData.USERNAME,
            password : this.props.rowData.PASSWORD,
            application : this.props.rowData.REPORT_NAME,
            sid : this.props.rowData.SID,
            configData : this.props.configData
        }*/
    }

    render(){
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Type</td>
                            <td><InputText name="TYPE" value={this.props.rowData.TYPE === undefined ? "" : this.props.rowData.TYPE } onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>Host</td>
                            <td><InputText name="HOST" value={this.props.rowData.HOST === undefined ? "" : this.props.rowData.HOST} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>Port</td>
                            <td><InputText name="PORT" value={this.props.rowData.PORT === undefined ? "" : this.props.rowData.PORT} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>Service</td>
                            <td><InputText name="SERVICE" value={this.props.rowData.SERVICE === undefined ? "" : this.props.rowData.SERVICE} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td><InputText name="USERNAME" value={this.props.rowData.USERNAME === undefined ? "" : this.props.rowData.USERNAME} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><InputText name="PASSWORD" value={this.props.rowData.PASSWORD === undefined ? "" : this.props.rowData.PASSWORD} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>SID</td>
                            <td><InputText name="SID" value={this.props.rowData.SID === undefined ? "" : this.props.rowData.SID} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                        <tr>
                            <td>Application</td>
                            <td><InputText name="REPORT_NAME" value={this.props.rowData.REPORT_NAME === undefined ? "" : this.props.rowData.REPORT_NAME} onChange={(e) => this.props.updateField(e)} /></td>
                        </tr>
                    </tbody>
                </table>

                <Button style={{display: 'flex',  margin: '10px', width: '100px'}} type="button" icon="pi pi-save" className="p-button-info" onClick={(event) => this.props.saveDBConfig()}>Save </Button>&nbsp;
            </div>
        )
    }
}
export default DBConfigForm;