/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class FormField extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Field inline={true}>
                <Label>{this.props.label}</Label>
                {this.props.children}
            </Field>
        );
    }
}

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    inline: PropTypes.bool
};

const Field = styled.div`
    margin-bottom: 15px;
    display: ${props => props.inline ? "inline" : ""};
    width: 100%;
`;

const Label = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-top:20px;
`;

export default FormField;