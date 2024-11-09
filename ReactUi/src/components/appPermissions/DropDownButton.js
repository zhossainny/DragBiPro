import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ListItem from './ListItem';

class DropDownButton extends React.Component{
    constructor(props, context) {
        super(props, context);
        
        this.state ={
            menuVisible:false,
            label: "Read Only"
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
    }

    onMenuClick(value){
        this.setState({
            label : value
        });
        this.toggleMenu();
        this.props.onChange(value);
    }

    toggleMenu(){
        this.setState({
            menuVisible : !this.state.menuVisible
        });
    }

    hideMenu(){
        this.setState({
            menuVisible : false
        });
    }

    render(){
        return(
            <DropDown>
                <Button onClick={this.toggleMenu} onBlur={this.hideMenu}>{this.state.label} </Button>
                <List visible={this.state.menuVisible}>
                        <ListItem onClick={this.onMenuClick} value="Admin">Admin</ListItem>
                        <ListItem onClick={this.onMenuClick} value="ReadWrite">Read/Write</ListItem>
                        <ListItem onClick={this.onMenuClick} value="ReadOnly">Read Only</ListItem>
                </List>
            </DropDown> 

        );
    }
}

DropDownButton.propTypes ={
    onChange : PropTypes.func.isRequired
};

const Button = styled.button`
    display: inline-block;
    border: 1px solid #c9c9c9;
    border-radius: 4px;
    padding: 10px 0px 10px 10px;
    background-color: #ffffff;
    cursor: pointer;
    white-space: nowrap;
    width: 110px;
    font-weight: 400;
    font-size: 0.85em;
    text-align: left;

      

    &:after{
        content: '';
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        width: 0; 
        height: 0; 
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid black;
    }
  
    &:hover{
        background-color: #eeeeee;
    }
`;

const DropDown = styled.label`
    display: inline-block;
    position: relative;
`;

const InputBox = styled.input`
    display: none;
`;

const List = styled.ul`
    display:${props=> props.visible ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0;
    min-width: 110px;
    margin: 2px 0 0 0;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.1);
    background-color: #ffffff;
    list-style-type: none;
`;


export default DropDownButton;