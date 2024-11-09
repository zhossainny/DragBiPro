import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faStar} from '@fortawesome/free-solid-svg-icons';

export function NavBarPopOutMenu(props){


    return (<Menu><Ul>
            <Li>Application 1<Icon icon={faStar}/></Li>
            <Li>Application 2<Icon icon={faStar}/></Li>
            <Li>Application 3<Icon icon={faStar}/></Li>
            <Li>Application 4<Icon icon={faStar}/></Li>
            <Li>Application 5<Icon icon={faStar}/></Li>
        </Ul>
    </Menu>);
}

function createMenu(apps){
    return apps.map(app=>{
        return (
            <MenuItem key={app.name}>
                <MenuLink to={`/browse/apps/${app.name}`}>
                    <MenuItemText>app.name</MenuItemText>
                </MenuLink>
            </MenuItem>
        );
    });
}

NavBarPopOutMenu.propTypes = {
    apps: PropTypes.array.isRequired
};


const MenuItem = styled.div`
    font-size: 0.875em;
    font-weight:400;
    font-style: normal;  
    background-color: ${props => props.active ? '#383d47' : 'transparent'};
    padding-left: 60px;
    &:hover  {
        background-color:#313543;
        cursor: pointer;
    }
`;

const Ul = styled.ul`
    font-weight: 400;
    font-size: 0.9em;
    list-style:none;
    padding: 0;  
`;


const Li = styled.li`
    padding: 15px 0px 15px 30px;
    color: #999;
    &:hover {
        cursor: pointer;
        color: white;
    }    
`;


const MenuItemText = styled.h3`
    margin-top:5px;
    margin-bottom:5px;
    font-family:"Raleway","Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight:400;
    font-size: 1.15em;
    font-style: normal;
    width:100%;
    border-radius: 3px;
    display: inline-block;
    color: ${props => props.active ? '#d1551d' : '#dddddd'};
`;

const MenuLink = styled(Link)`
    text-decoration: none;
    display:block;
    padding-top: 5px; 
    padding-bottom: 5px;  
    width:100%;
    height:100%;
`;

const Menu = styled.div`
    position: absolute;
    padding: 15px 0 15px 0;
    top: 0px;
    left: 230px;  
    width: 230px;
    background: #2a2c34;
`;

const Icon = styled(FontAwesomeIcon)`
    float:right;
    margin-right: 20px;
    vertical-align: baseline;
    width:12px !important;
    height:12px;
`;
