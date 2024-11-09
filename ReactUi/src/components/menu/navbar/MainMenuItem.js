import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";

const MainMenuItem = props => {
    function onClick() {
        props.onClick(props.value);
    }

    function routeFromValue() {
        return `/${props.value}`;
    }

    return (<Li active={props.active}>
                <NavLink to={routeFromValue()} onClick={onClick}>
                    <Icon icon={props.icon} />
                    {props.label}
                </NavLink>
            </Li>);
};

MainMenuItem.propTypes = {
    icon: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
};

const Li = styled.li`
    cursor: ${props => props.active ? 'pointer' : 'default'};  
    color: ${props => props.active ? 'white' : 'inherit'};
    width: 230px;
    &:hover {
        cursor: pointer;
        color: white;
    }

    a {
        display: inline-block;
        width: 100%;
        padding: 20px 0px 20px 15px;
        color: inherit;
    }
`;

const Icon = styled(FontAwesomeIcon)`
    margin-right:15px;
    vertical-align: baseline;
    width:12px !important;
    height:12px;
`;

export default MainMenuItem;