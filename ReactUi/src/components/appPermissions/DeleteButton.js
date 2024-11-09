import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class DeleteButton extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.onIconClicked = this.onIconClicked.bind(this);
    }

    onIconClicked(){
        this.props.onClick(this.props.value);
    }


    render(){
        return(<div>
            <Icon className="fa fa-times-circle fa-lg" aria-hidden="true" value={this.props.value} onClick={this.onIconClicked}/>
        </div>);
    }
}

DeleteButton.propTypes = {
    value : PropTypes.object.isRequired,
    onClick : PropTypes.func.isRequired
};

const Icon = styled.i`
    margin-top: 5px;
    &:hover {
        color: red;
        cursor: pointer;        
    }
`;

export default DeleteButton;