import React from 'react';
import styled from 'styled-components';

const PropValue = (props) => {

    return (
        <Input {...props}/>
    );
};

const Input = styled.input`
    padding: 3px;
    width: 15%;
    min-width: 200px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;
    background:#262626;
`;

export default PropValue;