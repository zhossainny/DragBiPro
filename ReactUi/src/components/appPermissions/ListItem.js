import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class ListItem extends React.Component{

    constructor(props, context) {
        super(props, context);
    
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.onClick(this.props.value);
    }


    render(){
        return(
            <Item onMouseDown={this.onClick}>{this.props.children}</Item>
        );
    }
}

ListItem.propTypes ={
    children : PropTypes.node,
    onClick : PropTypes.func.isRequired,
    value : PropTypes.string.isRequired
};


const Item = styled.li`
    padding: 10px 20px;
    cursor: pointer;
    white-space: nowrap;
    width: 75px;
    font-weight: 400;
    font-size: 0.8em;

    &:hover{
        background-color: #F5F5F5;
        cursor: pointer;
    }
`;

export default ListItem;