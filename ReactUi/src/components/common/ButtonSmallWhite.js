import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonSmallWhite = (props) => {
    return (
        <Button {...props}>{props.children}</Button>
    );
};

ButtonSmallWhite.propTypes = {
    children: PropTypes.node,
    minWidth: PropTypes.string
};

const Button = styled.button`
    float: right;
    background-color: #A020F0;
    margin: 0px 0px 15px 10px;
    border-color: #ccc;
    border-radius: 3px;
    border: 1px solid #ccc;
    min-width: ${props => props.minWidth || '50px'};
    padding: 5px 8px;
    font-size: 0.9em;
    text-decoration: none;
    display: inline-block;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    &:hover  {
        background-color: #F15C25};      
    }
`;

export default ButtonSmallWhite;