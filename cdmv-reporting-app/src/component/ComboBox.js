import React, {Component} from 'react';
import {Dropdown} from 'primereact/dropdown';

class ComboBox extends Component {

    render() {
        return (
                <div className="content-section implementation" style={{ display : 'inline-flex' }}>
                <Dropdown placeholder={this.props.placeHolder} value={this.props.value} options={this.props.options} onChange={this.props.onChange} 
                    optionLabel="name"/>
                </div>
        );
    }
}

export default ComboBox;