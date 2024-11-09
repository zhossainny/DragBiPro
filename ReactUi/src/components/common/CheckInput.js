
import React from 'react';
import styled from 'styled-components';

const CheckInput = (props) => {
    return <Input {...props}/>;
};

const Input = styled.input`
    display: inline-block;
    position: ${props=> props.position || 'initial'};   
    width: ${props=> props.width || 'initial'};
    min-width: ${props=> props.minWidth || 'initial'};
    padding: 3px;
    margin-left: ${props=> props.marginLeft || 'initial'};
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

export default CheckInput;