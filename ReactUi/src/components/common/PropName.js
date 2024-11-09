import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PropName = (props) => {

    return (
        <Label {...props}>{props.children}</Label>
    );
};

PropName.propTypes = {
    children: PropTypes.node
};

const Label = styled.label`
    margin-top: 5px;
    min-width: 100px;
    font-size:12px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #b2b2b2;
    background:#262626
    flex: 0 1 20%;
    
    .fa {
        color: #767b84;
        font-size: 14px;
        margin-left: 4px;
    }
`;

export default PropName;