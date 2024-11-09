import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CollectionContentContainer from "./CollectionContentContainer";
import CollectionPermissionsContainer from "./CollectionPermissionsContainer";

class CollectionPage extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedOption: "content",
            collection: null
        };

        this.onTabChange = this.onTabChange.bind(this);
    }

    componentDidMount() {
        let collection = this.props.match.params.collection;
        if (collection) {
            this.setState({ collection: collection });
        }
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
                    <Spacer />
                    <Tabs>
                        <TabInput id="tab1" value="content" type="radio" name="tabs"
                            checked={this.state.selectedOption === "content"} onChange={this.onTabChange} />
                        <TabLabel htmlFor="tab1">Contents</TabLabel>
                        <TabInput id="tab2" value="permissions" type="radio" name="tabs"
                            checked={this.state.selectedOption === "permissions"} onChange={this.onTabChange} />
                        <TabLabel htmlFor="tab2">Permissions</TabLabel>
                    </Tabs>
                </HeaderDiv>
                {this.state.selectedOption === "content" && this.state.collection ?
                    <CollectionContentContainer collection={this.state.collection} /> : null}
                {this.state.selectedOption === "permissions" && this.state.collection ?
                    <CollectionPermissionsContainer collection={this.state.collection} /> : null}
            </Container>
        );

    }
}

CollectionPage.propTypes = {
    onTabChange: PropTypes.func,
    match: PropTypes.object
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    overflow: hidden;
`;

const HeaderDiv = styled.div`
    padding-top:25px;
    width: 100%;
    display: table;
    background-color: white;
    border-bottom: 1px solid #e1e1e1;
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

export default CollectionPage;