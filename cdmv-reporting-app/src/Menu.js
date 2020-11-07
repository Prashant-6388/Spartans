import React, { Component } from 'react';
import './css/menu.css';

class Menu extends Component {    
    constructor(){
        super();
        this.state= {
            username: sessionStorage.getItem('userName'),
            access  : sessionStorage.getItem('access')
        }   
    }
    render() {
        return (
            <div className="navbar">
                <a href="/home">Home</a>               
                
                <div className="dropdown">
                    <button className="dropbtn">Report</button>
                    <div className="dropdown-content">
                        <a href="/allReport">All Reports</a>
                        {this.state.username == "admin" &&
                        <a href="/ibmReport">IBM Report</a> }
                        {this.state.access.indexOf('ALL')!== -1 && <a href="/addReport">Add Report</a> }
                    </div>
                </div>
                { this.state.access.indexOf('ALL') !== -1 && <div className="dropdown">
                    <button className="dropbtn">Admin</button>
                    <div className="dropdown-content">
                        <a href="/accessManagement">Access Management</a>
                        <a href="/dbConfig">DB Config</a>
                        <a href="/manageReport">Manage Report</a>
                        <a href="/userConfig">User Config</a>
                        <a href="/userRoleConfig">Group Role Config</a>
                    </div>
                </div> }
                <a href="/aboutus">About Us</a>
            </div>            
        )
    }
}

export default Menu;