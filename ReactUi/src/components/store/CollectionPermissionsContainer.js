import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as appActions from "../../actions/appActions";
import * as storeActions from "../../actions/storeActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Spacer from "../common/Spacer";
import { RingLoader } from "react-spinners";
import * as versionActions from "../../actions/versionActions";
import * as userActions from "../../actions/userActions";
import CollectionPermissions from "./CollectionPermissions";

export class CollectionPermissionsContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
        };

        this.addMembers = this.addMembers.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.updateMember = this.updateMember.bind(this);
    }

    componentDidMount() {
        this.props.actions.loadCollectionMembers(this.props.collection);
    }

    addMembers(collection, members){
        this.props.actions.addCollectionMembers(collection, members);
    }

    deleteMember(collection, member) {
        this.props.actions.deleteCollectionMember(collection, member);
    }

    updateMember(collection, member) {
        this.props.actions.updateCollectionMember(collection, member);
    }

    filterAndSortMembers(members, type){
        return members
            .filter(m=> m.type.toLowerCase() === type)
            .sort((a,b) => a.name.localeCompare(b.name));
    }


    render() {
        if (this.props.error) {
            return (<Content>
                <ErrorMessage>Error loading collection: {this.props.error}</ErrorMessage>
            </Content>);
        }
        let ready =
            this.props.users &&
            this.props.groups &&
            this.props.members.length > 0;

        return (
            <Content>
                {ready &&
                    <React.Fragment>
                        <Header>{this.props.collection.toUpperCase()} Permissions</Header>
                        <CollectionPermissions
                            addMembersHandler={this.addMembers}
                            deleteMembersHandler={this.deleteMember}
                            updateMembersHandler={this.updateMember}
                            allUsers={this.props.users}
                            allGroups={this.props.groups}
                            userMembers={this.filterAndSortMembers(this.props.members,"user")}
                            groupMembers={this.filterAndSortMembers(this.props.members,"group")}
                            collection={this.props.collection} />
                    </React.Fragment>}
                {!ready && <LoadingSpinnerContainer>
                    <RingLoader loading={true}
                        color={"#F39318"}
                        size={100}
                    />
                    <LoadingText>LOADING</LoadingText>
                </LoadingSpinnerContainer>}
            </Content>);
    }
}

CollectionPermissionsContainer.propTypes = {
    collection: PropTypes.string,
    error: PropTypes.string,
    collectionContents: PropTypes.array,
    members : PropTypes.array.isRequired,
    users : PropTypes.array.isRequired,
    groups : PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 50px;
    padding-top: 30px;
    height: calc(100% - 132px);
    width: 95%;
    margin: 30px auto;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 3px;
`;

const Header = styled.h2`
    display: inline-block;
    font-size: 1.25em;
    font-weight: 400;
    margin-bottom: 0;
    color: #d1551d;
`;

const ErrorMessage = styled.h2`
    font-size: 1.25em;
    font-weight: 400;
    margin-bottom: 20px;
    padding-top: 20px;
    color: red;
    display: inline-block;
`;

const LoadingSpinnerContainer = styled.div`
    position: relative;
    margin-top: 15%;
    left: 50%;
    margin-left: -75px;
`;

const LoadingText = styled.div`
    margin-left: 10px;
    margin-top: 40px;
    font-weight: 300;
    font-size: 1.5em;
    color: #fbbd6c;
`;

function mapStateToProps(state) {
    return{
        users : state.users,
        groups : state.groups,
        members : state.store.members,
        collectionContents : state.store.contents,
        error : state.store.error,
        userId: state.admin.userId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...appActions, ...versionActions, ...userActions, ...storeActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionPermissionsContainer);



