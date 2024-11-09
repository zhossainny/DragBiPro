import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BasicInput = ({placeholder, name, onTextChanged}) => {
    return(
        <InputText placeholder={placeholder}
                   name={name}
                   onChange={onTextChanged}/>
    );
};

const InputText = styled.input`
    padding: 8px 15px;
    margin: 0px 0;
    width: 100%;
    max-width: 300px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    margin-right: 10px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

BasicInput.propTypes = {
    name : PropTypes.string,
    placeholder : PropTypes.string,
    onTextChanged : PropTypes.func.isRequired
};

export default BasicInput;
