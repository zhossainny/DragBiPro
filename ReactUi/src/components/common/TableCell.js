import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class TableCell extends React.Component{

    constructor(props, context) {
        super(props, context);
    
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.onClick(this.props.tag);
    }

    render(){
        return(
            <Cell isIcon={this.props.isIcon} isLink={this.props.isLink} onClick={this.onClick}>{this.props.children}</Cell>
        );
    }
}

TableCell.propTypes ={
    isIcon : PropTypes.bool,
    isLink : PropTypes.bool,
    tag : PropTypes.object,    
    onClick : PropTypes.func,
    children : PropTypes.node
};

const Cell = styled.td`
    text-align: ${props => props.align ? props.align :'left'};
    color: #42526E;
    padding-top: 20px;
    padding-bottom:20px; 
    padding-right:25px;
    font-size:0.85em;
    text-overflow: ellipsis;
    &:hover {
        cursor: ${props => props.isIcon || props.isLink ? 'pointer' : 'normal'};
        font-weight: ${props => props.isLink ? '600' : 'normal'};
    }
`;

export default TableCell;