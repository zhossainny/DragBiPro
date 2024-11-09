import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


class AppEnvironments extends React.Component{

    render(){
        return(
                <DetailsDiv color={this.props.color}>
                    <Header>{this.props.label}</Header>
                    <Summary> 
                        <Column width="40%">
                            <Label>Version</Label>
                            <Label>Last Updated</Label>
                            <Label>UpdatedBy</Label>
                        </Column>
                        <Column width="60%">
                            <Value>{this.props.tag}</Value>
                            <Value>{this.props.timestamp}</Value>
                            <Value>{this.props.updatedBy}</Value>
                        </Column>
                    </Summary>
                </DetailsDiv>
        );
    }
}

AppEnvironments.propTypes = {    
    label : PropTypes.string.isRequired,
    tag : PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    updatedBy : PropTypes.string.isRequired,
    color : PropTypes.string.isRequired
};

const DetailsDiv = styled.div`
    margin-left: 60px;
    padding-left: 30px;
    background-color: white;
    border: 1px solid #e1e1e1;
    border-top: 3px solid ${props=> props.color};
    border-radius: 4px;
    display: inline-block;
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight:400;
    color: #42526E;
    display: inline-block;
`;


const Summary = styled.div`
    display: table;
    min-width: 300px;
`;

const Column = styled.div`
    display: table-cell;
    width: ${props=> props.width};
    height: 100%;
`;

const Value = styled.p`
    font-weight: 400;
    color: #888;
    margin-top: 20px;    
`;


const Label = styled.label`
    display: block;
    font-weight: 550;
    margin-top: 20px;     
    margin-bottom: 15px;    
`;

export default AppEnvironments;