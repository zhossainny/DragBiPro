import React, { useState } from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import * as _ from 'lodash';

const ToggleSelect = ({ name, option1, option2, selectedOption, defaultOption, onChange }) => {
    const [selected, setSelected] = useState(!_.isNil(selectedOption) ? selectedOption : defaultOption );
    function change(e) {
        let value = e.target.getAttribute('value');
        setSelected(value);
        onChange({ target: { name, value } });
    }

    return (<Container>
        <Toggle className={selected === option1 ? 'selected' : ''} onClick={change} value={option1}>{option1}</Toggle>
        <Toggle className={selected === option2 ? 'selected' : ''} onClick={change} value={option2}>{option2}</Toggle>

    </Container>);
};

ToggleSelect.propTypes = {
    option1: PropTypes.string.isRequired,
    option2: PropTypes.string.isRequired,
    selectedOption: PropTypes.string,
    defaultOption: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
};

const Container = styled.div`
    display: inline-flex;
    border: 1px solid #ccc;
    border-radius: 3px;
    min-width: 100px;
`;
const Toggle = styled.span`
    cursor: pointer;
    background-color: #262626;
    font-size: 13px;
    margin: 3px;
    border: 1px solid #ccc;
    border-radius: 3px;
    flex: 1;
    text-align: center;
    &:hover {
        background-color: rgba(204, 204, 204, 0.5);
    }
    &.selected, &.selected:hover {
        background-color: purple;
    }
`;
export default ToggleSelect;