import React from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import styled from 'styled-components';

const MultiSelect = (props) => {
    return (
        <ReactSelect {...props}>{props.children}</ReactSelect>
    );
};

MultiSelect.propTypes = {
    children: PropTypes.node,
    width: PropTypes.string
};

const ReactSelect = styled(Select)`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    padding: 0px;
    width: ${props => props.width};
    min-width: ${props => props.minWidth || '100px' };
    display: inline-block;
    vertical-align: middle;

    .Select-control {
        border-radius: 3px;
    }
`;

export default MultiSelect;