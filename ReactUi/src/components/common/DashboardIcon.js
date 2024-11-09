import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const DashboardIcon = (props) => {
    function handleClick() {
        props.onClick && props.onClick(props.value);
    }

    return (
        <FOIcon {...props} onClick={handleClick}/>
    );
};

DashboardIcon.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string
};

const FOIcon = styled(FontAwesomeIcon)`
    flex: 1;
    color: #5A5A5A;
    font-size: 1em;

    &:hover {
        cursor: pointer;
        color: orange;
    }
    &.disabled {
        cursor: none;
        pointer-events: none;
        color: rgba(66, 82, 110, 0.5);
    }
    &.favourite {
        color: #ff7261;
    }
`;

export default DashboardIcon;