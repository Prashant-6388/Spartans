import React, { Component } from 'react';
import {Calendar} from 'primereact/calendar';

class SimpleDatePicker extends Component {
         
    render() {
      return (
              <div style={{ display : 'inline-flex' }}>
                  <Calendar value={this.props.value} onChange={this.props.handleDateChange} showIcon={true} />
              </div>
        );
    }
}

export default SimpleDatePicker;