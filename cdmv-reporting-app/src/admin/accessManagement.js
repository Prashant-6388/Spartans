import React, { Component } from 'react';
import StickyFooter from '../StickyFooter';
import BaseTemplate from '../BaseTemplate';
import AccessManagementForm from '../form/AccessManagementForm';

class AccessManagement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const groupNames = [{ name: 'Select Group', code: 'Select Group'},
        { name: 'CISCO', code: 'CISCO' }, { name: 'IBM', code: 'IBM' }];
        return (
            <div style={{ marginTop: '115px' }}>
                <BaseTemplate />
                <AccessManagementForm groupNames={groupNames} />
                <StickyFooter />
            </div>
        );
    }

}

export default AccessManagement;