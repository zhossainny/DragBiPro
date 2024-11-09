import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


class AppSummary extends React.Component{
    render(){
        return(
            <DetailsDiv>
                <Header>Summary</Header>      
                {!this.props.editable ? <FormButton onClick={this.props.onClickEdit}>Edit</FormButton> : null}
                {this.props.editable ? <FormButton onClick={this.props.onClickSave}>Save</FormButton> : null}
                {this.props.editable ? <FormButton onClick={this.props.onClickCancel}>Cancel</FormButton> : null}
                <Summary> 
                    <Column width="40%">
                        <Label>Key</Label>
                        <Label>Type</Label>
                        <Label>Name</Label>                
                        <Label>Description</Label>
                    </Column>
                    <Column width="60%">
                        <Value>{this.props.appKey}</Value>
                        <Value>{this.props.type}</Value>
                        {this.props.editable 
                            ? <InputBox type="text" value={this.props.name} onChange={this.props.onNameChange} />
                            : <Value>{this.props.name}</Value>}
                        {this.props.editable 
                            ? <TextArea cols="40" rows="3" value={this.props.description} onChange={this.props.onDescriptionChange} />
                            : <Value>{this.props.description}</Value>}
                    </Column>
                </Summary>
            </DetailsDiv>
        );
    }
}

AppSummary.propTypes = {
    appKey : PropTypes.string.isRequired,
    type : PropTypes.string.isRequired,
    name : PropTypes.string.isRequired,
    editable : PropTypes.bool,
    description : PropTypes.string.isRequired,
    onClickEdit : PropTypes.func,
    onClickSave : PropTypes.func,
    onClickCancel : PropTypes.func,
    onNameChange : PropTypes.func,
    onDescriptionChange : PropTypes.func
};

const DetailsDiv = styled.div`
    height: 300px;
    margin: 60px 0px 60px 60px;
    margin-top: 50px;
    padding-left: 30px;
    padding-top: 10px;
    padding-right: 30px;
    background-color: white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
`;

const Summary = styled.div`
    display: table;
    width: 500px;
`;

const Column = styled.div`
    display: table-cell;
    width: ${props=> props.width};
    height: 100%;
`;

const Value = styled.p`
    width: 270px;
    font-weight: 400;
    color: #888;
    margin-top: 20px;    
    word-wrap: break-word;
`;

const InputBox = styled.input`
    font-weight: 400;
    color: #333;
    margin-top:2px;
    margin-bottom: 15px;
`;

const TextArea = styled.textarea`
    font-weight: 400;
    color: #333;
`;

const Label = styled.label`
    display: block;
    font-weight: 550;
    margin-top: 20px;    
    margin-left: 25px;    
    margin-bottom: 15px;    
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight:400;
    color: #42526E;
    display: inline-block;
    margin-bottom: 30px;
`;

const FormButton = styled.h3`
    display: inline-block;
    font-size: 1em;
    font-weight:400;
    color: 	#2FA7E0;
    float:right;
    margin-top: 22px;
    margin-right: 10px;

    &:hover {
        cursor: pointer;
        color: 	#185d7c;
    }
`;

export default AppSummary;