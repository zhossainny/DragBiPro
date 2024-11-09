import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';
import { PropTypes } from 'prop-types';

const ConfigItemValue = ({ onChange, options, type, value }) => {
    const [configItemValue, setConfigItemValue] = useState(toDisplayValue());

    useEffect(() => {
        if (value) {
            let newDisplayValue = toDisplayValue();
            changeValueAndTriggerOnChange(newDisplayValue);
        }
    }, [type]);

    function toDisplayValue() {
        if (type === 'text')
            return value;

        if (type === 'checkList' || type === 'dropDown') {
            return options.map(option => _.isObject(option) ? option.value : option).join('\r\n');
        }
    }

    function toRawValue(newValue) {
        if (type === 'text') {
            return newValue;
        }

        return sanitizeValue(newValue).join(',');
    }

    function sanitizeValue(value) {
        return value.split(/\r?\n/).filter(val => !!val).map(val => val.toString().trim());
    }

    function changeValueAndTriggerOnChange(newValue) {
        setConfigItemValue(newValue);
        onChange(toRawValue(newValue));
    }

    function onTextareaChanged(e) {
        changeValueAndTriggerOnChange(e.target.value);
    }

    return <TextBox value={configItemValue} onChange={onTextareaChanged} />;
};

ConfigItemValue.propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    type: PropTypes.string,
    value: PropTypes.string
};

const TextBox = styled.textarea`
    padding: 8px 15px;
    margin: 0px 0;
    width: 300px;
    min-height: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;
export default ConfigItemValue;