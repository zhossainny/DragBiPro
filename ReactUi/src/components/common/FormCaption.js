import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FormCaption = (props) => {
    return (
        <Label>{props.children}</Label>
    );
};

FormCaption.propTypes = {
    children: PropTypes.node
};

const Label = styled.label`
    color: #d1551d;
    font-size: 18px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export default FormCaption;