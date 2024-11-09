import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RSelect from "react-select";
import AppPermissionsTable from '../appPermissions/AppPermissionsTable';
import {connect} from "react-redux";
import * as adminActions from "../../actions/adminActions";
import {bindActionCreators} from "redux";
import {ProgressBar} from "react-bootstrap";
import Spacer from "../common/Spacer";
import jquery from "jquery";
import * as appActions from "../../actions/appActions";
import ButtonSmallWhite from './../common/ButtonSmallWhite';

class AdminPermissionEditorContainer extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            initialized: false,
            selectedPrincipal: null,
            dirtyAppMembership: null,
            dirtyUserApps: null,
            membershipChanges: {},
            showHelperButtons: false,
            error: null
        };

        this.saveMembershipChanges = this.saveMembershipChanges.bind(this);
        this.resetMembershipChanges = this.resetMembershipChanges.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.isCheckBoxChecked = this.isCheckBoxChecked.bind(this);
        this.membershipChangedHandler = this.membershipChangedHandler.bind(this);
        this.addAppHandler = this.addAppHandler.bind(this);
        this.deleteAppHandler = this.deleteAppHandler.bind(this);
    }

    helperButtons() {
        return (
            <div>
                 <ButtonSmallBlue onClick={this.saveMembershipChanges}>Save</ButtonSmallBlue>
                 <ButtonSmallWhite onClick={this.resetMembershipChanges}>Reset</ButtonSmallWhite>
            </div>
        );
    }

    updateStateIfNeeded() {
        if (this.isDataLoaded() && !this.state.initialized) {
            this.setState({
                    dirtyAppMembership:  jquery.extend(true, {}, this.props.appMembership),
                    dirtyUserApps:  jquery.extend(true, [], this.props.selectedUserApps),
                    membershipChanges: {},
                    initialized: true
                }
            );
        }
    }

    isDataLoaded() {
        if (this.props.appsLoading && this.props.requestsInProgress === 0) return false;
        let userAppsLoaded = !!this.props.selectedUserApps;
        let appMembershipsLoaded = Object.keys(this.props.appMembership).length !== 0;
        return userAppsLoaded && appMembershipsLoaded;
    }

    handleUserChange(selectedPrincipal) {
        if (!selectedPrincipal) return;
        this.setState({
            selectedPrincipal: selectedPrincipal
        });
        this.refreshUserMemberships(selectedPrincipal.value);
    }

    refreshUserMemberships(user) {
        if (!user)return;
        let userId = user.username;
        let isGroup = !!user.type ;
        if (userId) {
            let appKeys = this.props.currentUserApps.map(app => {
                return app.key;
            });
            this.props.actions.loadAdminData(userId, isGroup, appKeys);
        }
        this.setState({
            initialized: false
        });
    }

    //display only the apps that a selected user doesn't have
    //current user needs to be an admin
    getAvailableApps() {
        if (!this.state.dirtyUserApps) return;

        if (!this.state.dirtyUserApps) {
            //selected user/group doesn't have any apps assigned
            return this.props.currentUserApps.map(app => {
                return app.key;
            });
        }

        if (!this.props.currentUserAppsByRole.Admin) return;

        let selectedUserAppKeys = this.state.dirtyUserApps.map(app => {
            return app.key;
        });

        let availableApps = [];
        for (let adminApp of this.props.currentUserAppsByRole.Admin) {
            if (selectedUserAppKeys.includes(adminApp.key))
                continue;
            availableApps.push(adminApp);
        }
        return availableApps;
    }

    isCheckBoxChecked(appKey, role) {

        if (!this.state.selectedPrincipal || !this.state.dirtyAppMembership) {
            return false;
        }
        let appMembers = this.state.dirtyAppMembership[appKey];
        if (appMembers) {
            for (let member of appMembers) {
                if (member.id === this.state.selectedPrincipal.value.username && member.role.toLowerCase() === role) {
                    return true;
                }
            }
        }
        return false;
    }

    getListOfUsersAndGroups() {
        let groupsAsObjects = this.props.groups.map(groupName => {
            return {
                display: groupName.value,
                value: {
                    value: groupName.value,
                    label: groupName.value,
                    username: groupName.value,
                    id: groupName.value,
                    type: "group"
                }
            };
        });
        let usersAndGroups = this.props.users.concat(groupsAsObjects);
        usersAndGroups = usersAndGroups.filter(item => {
            return !!(item.display && item.display !== "" && item.display.toString().trim() !== "");
        });
        return usersAndGroups.map(principal => {
            return {
                value: principal.value,
                label: principal.display
            };
        });
    }

    membershipChangedHandler(membershipChange) {
        this.processMembershipChange(membershipChange);
    }

    saveMembershipChanges() {
        if (confirm('Save ' + Object.keys(this.state.membershipChanges).length + ' change(s) for ' + this.state.selectedPrincipal.label)) {
            let member = {
                id: this.state.selectedPrincipal.value.username,
                type: this.state.selectedPrincipal.value.type ? "GROUP" : "USER",
                role: ""
            };
            let _this = this;
            let addPermissions = [];
            let removePermissions = [];
            let changePermissions = [];
            Object.keys(this.state.membershipChanges).forEach(function(key) {
                let change = _this.state.membershipChanges[key];
                member.role = change.role ? change.role :"todo";
                switch (change.type){
                    case "add": {
                        addPermissions.push({member: member, appKey: change.app.key});
                        break;
                    }
                    case "delete": {
                        let members = _this.props.appMembership[key];
                        let originalMembership = members.filter(m => m.id === member.id);
                        if (originalMembership.length > 0) {
                            member.role = originalMembership[0].role;
                            removePermissions.push({member: member, appKey: change.app.key});
                        }
                        break;
                    }
                    case "change":
                        changePermissions.push({member: member, appKey: change.app.key});
                        break;
                }
            });

            let appKeys = this.props.currentUserApps.map(app => {
                return app.key;
            });
            this.props.actions.savePermissionChanges(addPermissions, removePermissions, changePermissions,
                member.id, member.type === "GROUP", appKeys);

            this.setState({
                showHelperButtons: false
            });
        }
    }

    resetMembershipChanges() {
        this.setState(
            {
                membershipChanges: {},
                showHelperButtons: false,
                dirtyAppMembership:  jquery.extend(true, {}, this.props.appMembership),
                dirtyUserApps:  jquery.extend(true, [], this.props.selectedUserApps)
            }
        );
    }

    addAppHandler(membershipChange) {
        this.processMembershipChange(membershipChange);
    }

    processMembershipChange(membershipChange) {
        let currentChanges = jquery.extend(true, {}, this.state.membershipChanges);
        currentChanges[membershipChange.app.key] = membershipChange;
        this.setState({
            membershipChanges: currentChanges
        });

        let selectedUserId = this.state.selectedPrincipal.value.username;
        let tempMembership = jquery.extend(true, [], this.state.dirtyAppMembership);
        let members = tempMembership[membershipChange.app.key];
        let dirtyUserApps = this.state.dirtyUserApps;
        if (members) {
            switch (membershipChange.type){
                case 'add': {
                    let newMember = {
                        id: selectedUserId,
                        type: this.state.selectedPrincipal.value.type ? "GROUP" : "USER",
                        role: membershipChange.role
                    };
                    members.push(newMember);
                    tempMembership[membershipChange.app.key] = members;
                    dirtyUserApps = dirtyUserApps.concat(membershipChange.app);
                    break;
                }
                case 'delete':
                    members = members.filter(member => member.id !== selectedUserId);
                    tempMembership[membershipChange.app.key] = members;
                    dirtyUserApps = dirtyUserApps.filter(app => app.key !== membershipChange.app.key);
                    break;
                case 'change':
                    for (let member of members) {
                        if (member.id === selectedUserId) {
                            member.role = membershipChange.role;
                            break;
                        }
                    }
                    break;
            }
        }

        this.setState({
            dirtyAppMembership: tempMembership,
            dirtyUserApps: dirtyUserApps,
            showHelperButtons: true
        });
    }

    deleteAppHandler(membershipChange) {
        this.processMembershipChange(membershipChange);
    }

    render() {
        this.updateStateIfNeeded();
        let dirty = Object.keys(this.state.membershipChanges).length > 0;
        let userLookupValues = this.getListOfUsersAndGroups();
        let appLookupValues = this.getAvailableApps();
        let selectedUserApps = dirty ? this.state.dirtyUserApps : this.props.selectedUserApps;
        let tableTitle = this.state.selectedPrincipal ? this.state.selectedPrincipal.label + "'s Apps:" : "Apps:";
        return (
            <InlineContainer>
                <InlineContainer>
                    <TypeAhead
                        placeholder="Select a user/group"
                        value={this.state.selectedPrincipal}
                        onChange={this.handleUserChange}
                        options={userLookupValues}
                        openOnClick={false} />
                </InlineContainer>
                {this.props.appsLoading && !this.props.saving && <Progress active now={100} label={"Loading"} />}
                {this.props.saving && <Progress active now={100} label={"Saving"} />}
                {this.state.initialized && !this.props.appsLoading &&
                <InlineContainer>
                    <AppPermissionsTable
                        placeholder="Select an app"
                        title={tableTitle}
                        selectedUserApps={selectedUserApps}
                        currentUserApps={this.props.currentUserAppsByRole.Admin}
                        isCheckboxChecked={this.isCheckBoxChecked}
                        onMemberPermissionChange={this.membershipChangedHandler}
                        addApp={this.addAppHandler}
                        deleteApp={this.deleteAppHandler}
                        lookupValues={appLookupValues}>
                        {(dirty && this.state.showHelperButtons) ?
                            this.helperButtons() : <Spacer horizontalSpacing={0} verticalSpacing={20}/>}
                    </AppPermissionsTable>
                </InlineContainer>}
            </InlineContainer>
        );
    }
}

function mapStateToProps(state) {

    let groups = state.groups.map(group => {
        return {value: group, display: group};
    });

    let users = state.users.map(user => {
        return {value: user, display: user.firstName + " " + user.lastName};
    });

    return {
        groups: groups,
        users: users,
        currentUserApps: state.apps,
        currentUserAppsByRole: state.appsByRole,
        selectedUserApps: state.admin.permissionedApps,
        appMembership: state.admin.membersByAppKey,
        currentUserId: state.admin.userId,
        appsLoading: state.admin.appsLoading,
        saving: state.admin.permissionsSaving,
        notification: state.admin.notification,
        requestsInProgress: state.admin.requestsInProgress
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...adminActions, ...appActions}, dispatch)
    };
}

const Progress = styled(ProgressBar)`
    width: 100%;
`;

const InlineContainer = styled.div`  
    display: inline-block;
    width: 100%;
`;

const TypeAhead = styled(RSelect)`
    width: 100%;
    margin-bottom: 5px;
    margin-top: 5px;
    display:inline-block;
    float: left;
`;

const ButtonSmallBlue = styled.button`
    float: right;
    width: 70px;
    height: 29px;
    background-color: #337ab7;
    border: none;
    border-radius: 3px;
    min-width: 50px;
    color: white;
    margin: 0px 0px 15px 10px;
    padding: 5px 8px;
    text-decoration: none;
    display: inline-block;
    opacity: ${props => props.disabled ? '0.7' : '1'};
    &:hover  {
        background-color: ${props => props.disabled ? '#337ab7' : '#2d6fa8'};
        cursor: ${props => props.disabled ? 'hand' : 'pointer'};
    }
`;

AdminPermissionEditorContainer.propTypes = {
    users : PropTypes.array,
    apps : PropTypes.array,
    groups : PropTypes.array,
    actions: PropTypes.object,
    currentUserApps: PropTypes.array,
    currentUserAppsByRole: PropTypes.object,
    selectedUserApps: PropTypes.array,
    appMembership: PropTypes.object,
    currentUserId: PropTypes.string,
    appsLoading: PropTypes.bool,
    saving: PropTypes.bool,
    notification: PropTypes.object,
    requestsInProgress: PropTypes.number
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPermissionEditorContainer);
