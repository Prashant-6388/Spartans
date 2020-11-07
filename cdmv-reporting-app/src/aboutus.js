import React, { Component } from 'react';
import StickyFooter from './StickyFooter';
import BaseTemplate from './BaseTemplate';


class AboutusScreen extends Component {
    render() {
        return (
            <div>
                <BaseTemplate />
                <div style={{position:'absolute', top:'50%'}}>
                    <h2>This is a CDMV Report application POC created by Scrum team members Prashant and Venu using React js.</h2>
                    <h2>This application is currently displaying T1 report and Rexa report based on some inputs which includes time range and Rexa / T1 statuses.</h2>                
                </div>
                <StickyFooter />
            </div>
        );
    }

}

export default AboutusScreen;