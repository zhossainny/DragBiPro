import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CollectionOverviewContainer from "./CollectionOverviewContainer";

class StorePage extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedOption: "collections"
        };

        this.onTabChange = this.onTabChange.bind(this);
    }

    onTabChange(e) {
        this.setState({
            selectedOption: e.target.value
        });
    }

    render() {
        return (
            <Container>
                <HeaderDiv>
                    <Spacer/>
                    <Tabs>
                        <TabInput id="tab1" value="collections" type="radio" name="tabs"
                                  checked={this.state.selectedOption === "collections"} onChange={this.onTabChange}/>
                        <TabLabel htmlFor="tab1">Collections</TabLabel>
                    </Tabs>
                </HeaderDiv>
                <ContentDiv>
                    {this.state.selectedOption === "collections" ?
                        <CollectionOverviewContainer/> : null}
                </ContentDiv>
            </Container>
        );
    }
}

StorePage.propTypes = {
    onTabChange: PropTypes.func
};

const Container = styled.div`
    height: 100%;
    width: 100%;
`;

const HeaderDiv = styled.div`
    padding-top:25px;
    width: 100%;
    display: table;
    background-color: white;
    border-bottom: 1px solid #e1e1e1;
`;

const ContentDiv = styled.div`
    height:80%;
`;

const Spacer = styled.div`
    height:100%;
    width: 20px;
    display: table-cell;
`;


const Tabs = styled.div`
    height:100%;
    width: 600px;
    margin-left: 100px;
    vertical-align: bottom;
    display: table-cell;
`;

const TabInput = styled.input`
    display: none;
    border-bottom: 1px solid #000;

    &:checked+label{
        color: #555;
        font-weight:600;
        border-bottom: 2px solid orange;
    }
`;

const TabLabel = styled.label`
    display: inline-block;
    margin: 0 0 -1px;
    padding: 12px 50px;
    font-family:Roboto,"Helvetica Neue", Helvetica, Arial, sans-serif;    
    font-weight:400;
    font-style: normal;
    text-align: center;
    color: #8c8a8a;
    border: 1px solid transparent;

    &:hover{
        color: #888;
        cursor: pointer;
        font-weight:600;
    }
`;


export default StorePage;