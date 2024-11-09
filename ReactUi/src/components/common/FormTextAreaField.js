import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormField from './FormField';

class FormTextAreaField extends React.Component{

    render(){
        return(
            <FormField label={this.props.label}>
                <TextArea  onChange={this.props.onTextChanged} rows={this.props.rows} cols={this.props.cols}/>
            </FormField>
        );
    }
}

FormTextAreaField.propTypes = {
    label : PropTypes.string.isRequired,
    onTextChanged : PropTypes.func.isRequired,
    rows : PropTypes.string.isRequired,
    cols : PropTypes.string.isRequired
};

const TextArea = styled.textarea` 
    padding: 8px 15px;
    margin: 0px 0px 15px 0px;    
    width: 100%;
    max-width: 300px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    resize: none;
`;
export default FormTextAreaField;
