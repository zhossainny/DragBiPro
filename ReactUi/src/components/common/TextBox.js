import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import faPencil from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TextBox extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.mapRef = this.mapRef.bind(this);
    }

    mapRef(inputRef) {
        this.textInput = inputRef;
      }
      

    blur(){
        this.textInput.blur();
    }

    render(){
        return(
            <InputBox width ={this.props.width} showBorder={this.props.selected}>
                <PencilIcon width ={this.props.width} icon={faPencil} show={this.props.selected}/>
                <InputText type="text" 
                        width ={this.props.width}
                        showBorder={this.props.selected} 
                        value={this.props.value} 
                        onChange={this.props.onChange}                         
                        onKeyDown={this.props.onKeyDown}
                        onBlur={this.props.onBlur}
                        innerRef={this.mapRef}
                         />                    
            </InputBox>            
        );
    }
}

TextBox.propTypes = {
    width: PropTypes.string.isRequired,
    selected : PropTypes.bool,
    value : PropTypes.string,
    onChange : PropTypes.func,
    onKeyDown : PropTypes.func,
    onBlur : PropTypes.func
};

const InputBox = styled.div`
    border-radius: 4px;
    position: relative;
    width: calc(${props => props.width} + 50px);
    height: 30px;
    display: inline-block;

    border: ${props => props.showBorder ? '1px solid #DDD' : 'none'};
`;

const InputText = styled.input`
    padding: 6px 10px;
    margin: 0px 0;
    height: 18px;
    width: ${props => props.width};
    display: inline-block;
    border: none;
    border-radius: 0px;
    font-size:14px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #555;
    border-right: ${props => props.showBorder ? '1px solid #DDD' : 'none'};
`;

const PencilIcon =styled(({width, show, children, ...props}) => React.createElement(FontAwesomeIcon, props, children))`
    color: #555;
    opacity: 0.9;
    position: absolute;
    top: 7px;
    left: calc(${props => props.width} + 25px);
    font-size: 15px;
    visibility :  ${props => props.show ? 'visible' : 'collapse'};
`;

export default TextBox;