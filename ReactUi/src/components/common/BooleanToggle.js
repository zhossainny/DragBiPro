import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import * as _ from 'lodash';

const BooleanToggle = ({ checked, onChange, name }) => {
    const [isChecked, setChecked] = useState(_.isBoolean(checked) ? checked : false);

    useEffect(() => {
        if (isChecked !== checked) {
            setChecked(checked);
        }
    }, [checked]);
    
    function change(e) {
        setChecked(e.target.checked);
        onChange({ target: { name, value: e.target.checked } });
    }

    return (
        <Switch>
            <input type="checkbox" checked={isChecked} value={isChecked} onChange={change} />
            <span className="slider" />
        </Switch>);
};

BooleanToggle.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
};

const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    margin-bottom: 0;
    vertical-align: middle;

    input {
        opacity: 0;
        width: 0;
        height: 0;
        &:focus {
            outline: none;
        }
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 34px;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        border-radius: 50%;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
`;



export default BooleanToggle;