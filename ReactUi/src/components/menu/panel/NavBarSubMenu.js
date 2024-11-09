import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export function NavBarSubMenu(props) {
    return (
        <div>
            <Ul active={props.active} onClick={props.onClick}>
                {props.subcategories.map(subcategory => (<Li key={subcategory.name}>{subcategory.name}</Li>))}
            </Ul>
        </div>
    );
}

NavBarSubMenu.propTypes = {
    onClick: PropTypes.func,
    active: PropTypes.bool,
    subcategories: PropTypes.array.isRequired,
    selectedSubcategory: PropTypes.string
};

const Ul = styled.ul`
    font-weight: 400;
    font-size: 0.9em;
    list-style:none;
    padding: 0;
    margin-top:5px;
       
    max-height: ${props => props.active ? ((props.items * 36) + 30) + "px" : "0"};
    opacity: ${props => props.active ? 1 : 0};
    overflow:  ${props => props.active ? "inherit" : "hidden"};
    padding: "5px 0";
    transition: all 0.5s ease;
    
`;


const Li = styled.li`
    padding: 10px 0px 10px 30px;
    color: #999;
    &:hover {
        cursor: pointer;
        color: #ff7261;
    }    
`;

export default NavBarSubMenu;