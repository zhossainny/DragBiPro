import React from 'react';
import PropTypes from 'prop-types';

import FormField from './FormField';
import BasicInput from "./BasicInput";

class FormTextField extends React.Component{

    render(){
        return(
            <FormField label={this.props.label} inline={this.props.inline}>
                <BasicInput  onTextChanged={this.props.onTextChanged}/>
            </FormField>
        );
    }
}

FormTextField.propTypes = {
    label : PropTypes.string.isRequired,
    onTextChanged : PropTypes.func.isRequired,
    inline : PropTypes.bool
};

export default FormTextField;
