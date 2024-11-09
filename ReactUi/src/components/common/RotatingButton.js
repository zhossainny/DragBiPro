import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class RotatingButton extends React.Component{
    
    constructor(props, context) {
        super(props, context);
        
        this.onClick = this.onClick.bind(this);
        this.rotated = false;
    }

    onClick(){      
        this.props.onClick(this.props.tag, this.props.rotate);
    }

    render(){
        return(
            <ButtonIcon icon={this.props.icon} rotate={this.props.rotate} color={this.props.color} onClick={this.onClick}/>
        );
    }
}

RotatingButton.propTypes = {
    rotate : PropTypes.bool,
    onClick : PropTypes.func,
    color : PropTypes.string
};

const ButtonIcon = styled(({rotate, children, ...props}) => React.createElement(FontAwesomeIcon, props, children))`
    -moz-transition: all 2s linear;
    -webkit-transition: all 2s linear;
    transition: all 0.2s linear;

    -ms-transform: ${props => props.rotate ? 'rotate(180deg)' : 'none'};
    -moz-transform: ${props => props.rotate ? 'rotate(180deg)' : 'none'};
    -webkit-transform: ${props => props.rotate ? 'rotate(180deg)' : 'none'};
    transform: ${props => props.rotate ? 'rotate(180deg)' : 'none'};

    color: ${props => props.color ? props.color : '#42526E'};
    height: 17px;
    width: 17px;
    margin-top: 2px;    
`;

RotatingButton.propTypes = {
    icon : PropTypes.object,
    tag : PropTypes.object,
    onClick : PropTypes.func
};
      
export default RotatingButton;