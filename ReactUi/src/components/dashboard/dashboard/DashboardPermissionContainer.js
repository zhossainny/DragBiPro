import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as appActions from "../../../actions/appActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import AppPermissions from "../../app/AppPermissions";
import * as userActions from "../../../actions/userActions";
import * as versionActions from "../../../actions/versionActions";
import {RingLoader} from "react-spinners";

export class DashboardPermissionContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            apps: null,
            initialised: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.app != null && !state.initialised){
            props.actions.loadMembers(props.app.key);
            return { initialised: true }
        }
        return null;
    }

    filterAndSortMembers(members, type){
        return members
                .filter(m=> m.type.toLowerCase() === type)
                .sort((a,b) => a.name.localeCompare(b.name));
    }

    render() {
        let ready = this.props.app &&
            this.props.users &&
            this.props.groups &&
            this.props.members.length > 0;

        return (
            <Content>
                {ready &&
                <React.Fragment>
                    <Header>{this.props.app.name} Dashboard Permissions</Header>
                    <AppPermissions
                        allUsers={this.props.users}
                        allGroups={this.props.groups}
                        userMembers={this.filterAndSortMembers(this.props.members,"user")}
                        groupMembers={this.filterAndSortMembers(this.props.members,"group")}
                        appKey={this.props.app.key}/>
                </React.Fragment>}
                {!ready && <LoadingSpinnerContainer>
                    <RingLoader loading
                                color={"#F39318"}
                                size={100}
                    />
                    <LoadingText>LOADING</LoadingText>
                </LoadingSpinnerContainer>}
            </Content>);
    }
}

DashboardPermissionContainer.propTypes = {
    app: PropTypes.object.isRequired,
    apps : PropTypes.array.isRequired,
    users : PropTypes.array.isRequired,
    groups : PropTypes.array.isRequired,
    members: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

const Content = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    margin: 30px 20px;
    padding: 30px;
    padding-top: 10px;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
`;


const LoadingSpinnerContainer = styled.div`
    margin: auto;
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight: 400;
    padding-top: 20px;
    color: #42526E;
    display: block;
    margin: auto;
`;

const LoadingText = styled.div`
    margin-left: 10px;
    margin-top: 40px;
    font-weight: 300;
    font-size: 1.5em;
    color: #fbbd6c;
`;



function mapStateToProps(state, ownProps) {
    let appKey = ownProps.match.params.appKey;
    let app = state.apps.filter(app=> app.key===appKey)[0];

    return{
        app : app,
        apps: state.apps,
        users : state.users,
        groups : state.groups,
        members : state.members,
        allMembers: state.members
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...appActions, ...versionActions,...userActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPermissionContainer);



