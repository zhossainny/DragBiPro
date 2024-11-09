import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from "react-redux";
import * as adminActions from "../../actions/adminActions";
import {bindActionCreators} from "redux";
import BasicInput from "../common/BasicInput";
import {ProgressBar} from "react-bootstrap";
import Spacer from "../common/Spacer";
import AdminGroupTable from "./AdminGroupTable";

class AdminGroupEditorContainer extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            groupsVisible: false,
            newGroup: {
                groupName: null,
                groupAlias: null
            }
        };

        this.handleAddNewGroup = this.handleAddNewGroup.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.toggleGroupVisibility = this.toggleGroupVisibility.bind(this);
    }

    onTextChanged(e) {
        const field = e.target.name;
        const value = e.target.value;
        const copy = Object.assign({}, this.state.newGroup);
        copy[field] = value;
        return this.setState({
            newGroup: copy
        });
    }

    handleAddNewGroup(e) {
        this.props.actions.clearAdminNotification();
        this.setState({
            error: null
        });
        let name = this.state.newGroup.groupName;
        let alias = this.state.newGroup.groupAlias;
        if (!name || !alias) {
            this.setState({
                error: "Please fill in all fields!"
            });
            return;
        }
        let contains = this.props.groups.some(val => val.display.toString().toLowerCase() === name.toString().toLowerCase() ||
            val.display.toString().toLowerCase() === alias.toString().toLowerCase());
        if (contains) {
            this.setState({
                error: "Group '" + name + "' already exists"
            });
        } else {
            this.setState({
                saving: true,
                error: null
            });
            this.props.actions.createGroup(name, alias);
        }
    }

    toggleGroupVisibility() {
        this.setState({groupsVisible: !this.state.groupsVisible});
    }

    render() {
        return (
            <div>
                <HorizontalContainer>
                    <HeaderSmall>Create New Group</HeaderSmall>
                    <BasicInput name="groupName" placeholder="Name" onTextChanged={this.onTextChanged}/>
                    <BasicInput name="groupAlias" placeholder="Alias" onTextChanged={this.onTextChanged}/>
                    <ButtonBlue onClick={this.handleAddNewGroup}>Add</ButtonBlue>
                </HorizontalContainer>
                {this.state.error && <ErrorMessage>{this.state.error}</ErrorMessage>}
                <Spacer verticalSpacing={20} horizontalSpacing={0}/>
                {this.props.saving && <Progress active now={100} label={"Saving"}/>}
                <ButtonSmall onClick={this.toggleGroupVisibility}>
                    {this.state.groupsVisible ? "Hide" : "Show"} Existing
                </ButtonSmall>
                {this.state.groupsVisible && <AdminGroupTable groups={this.props.groups}/>}
            </div>
        );
    }
}

const HorizontalContainer = styled.div`  
`;

const ErrorMessage = styled.p`
    color: red;
    padding-top: 5px;
    font-size:0.9em;
`;

const Progress = styled(ProgressBar)`
    width: 705px;
    margin-top:-5px;
`;


const HeaderSmall = styled.h3`
    font-size:1.0em;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
    margin-bottom: 15px; 
`;

const ButtonBlue = styled.button`
    background-color: #337ab7;
    border: none;
    border-radius: 3px;
    min-width: 80px;
    color: white;
    margin-left: 5px;
    padding: 8px 15px;
    text-decoration: none;
    display: inline-block;
    opacity: ${props => props.disabled ? '0.7' : '1'};
    &:hover  {
        background-color: ${props => props.disabled ? '#337ab7' : '#2d6fa8'};
        cursor: ${props => props.disabled ? 'hand' : 'pointer'};
    }
`;

const ButtonSmall = styled.button`
    background-color: #fff;
    border-color: #ccc;
    border-radius: 3px;
    border: 1px solid #ccc;
    min-width: 50px;
    padding: 5px 8px;
    font-size: 0.9em;
    text-decoration: none;
    display: inline-block;
    &:hover  {
        background-color: buttonface};      
    }
`;

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
        notification: state.admin.notification,
        saving: state.admin.groupsSaving
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...adminActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminGroupEditorContainer);

AdminGroupEditorContainer.propTypes = {
    actions: PropTypes.object,
    groups: PropTypes.array,
    notification: PropTypes.object,
    saving: PropTypes.bool
};