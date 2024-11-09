import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as appActions from '../../actions/appActions';
import * as versionActions from '../../actions/versionActions';
import * as userActions from '../../actions/userActions';

import AppPage from './AppPage';
import Content from '../common/Content';

class AppPageContainer extends React.Component{

    constructor(props, context) {
        super(props, context);
    
        this.onSaveSummary = this.onSaveSummary.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
    }

    onSaveSummary(appMeta){
        this.props.actions.saveAppMeta(appMeta);
    }

    onTabChange(selection){
        if(selection === "versions"){
            this.props.actions.loadVersions(this.props.app.key);
        }
        else if(selection == "permissions"){
            this.props.actions.loadMembers(this.props.app.key);
        }
    }

    render(){
        
        return(<Content>
                <AppPage app={this.props.app} 
                        versions={this.props.versions} 
                        allUsers={this.props.users}
                        allGroups={this.props.groups}
                        userMembers={this.props.userMembers}
                        groupMembers={this.props.groupMembers}
                        onSaveSummary={this.onSaveSummary} 
                        onTabChange={this.onTabChange}/>
            </Content>  
        );
    }
}


AppPageContainer.propTypes = {
    app: PropTypes.object.isRequired,
    users : PropTypes.array.isRequired,
    groups : PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    userMembers: PropTypes.array.isRequired,
    groupMembers: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

function extractApp(state, appKey){
    if(!state.apps.length){
        return {
            key: "",
            appType: "",
            name: "",
            description: ""
        };
    }

    let app = state.apps.filter(app=> app.key===appKey)[0];

    return app;
}

function userDisplayName(firstName, lastName, username){
    return firstName && lastName ? lastName + ", "  + firstName + " (" + username + ")" 
                                 : username;
}

function memberDisplayName(id, allUsers){
    let user =  allUsers.find(user=> user.username === id);

    if(user){
        return user.firstName && user.lastName ? user.lastName + ", "  + user.firstName : id;
    }

    return id;
}

function mapStateToProps(state, ownProps) {
    let appKey = ownProps.match.params.appKey;

    let app = extractApp(state, appKey);

    let versions = state.versions;
    
    let users = state.users
        .map(u=>{
            return{
                id: u.username,
                display: userDisplayName(u.firstName, u.lastName, u.username)
            };
        })
        .sort((a,b) => a.display.localeCompare(b.display));

    let userMembers = state.members
        .filter(m=> m.type.toLowerCase() === "user")
        .map(member=>{
            return{...member, 
                  display: memberDisplayName(member.id, state.users)
                };
        })
        .sort((a,b) => a.display.localeCompare(b.display));

    
    let groupMembers =  state.members
        .filter(m=> m.type.toLowerCase() === "group").map(member=>{
            return{...member, display: member.id};
        })
        .sort((a,b)=> a.alias.localeCompare(b.id));
        
    let groups = state.groups.map(group=>{
        return { id: group, display: group};
    });

    return{
        app : app,
        versions : versions,
        users : users,
        groups : groups,
        userMembers : userMembers,
        groupMembers : groupMembers
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...appActions, ...versionActions,...userActions}, dispatch)
    };
}
    
export default connect(mapStateToProps, mapDispatchToProps)(AppPageContainer);
