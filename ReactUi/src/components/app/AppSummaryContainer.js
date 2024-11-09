import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as appActions from '../../actions/appActions';

import AppSummary from './AppSummary';

class AppSummaryContainer extends React.Component{

    constructor(props, context) {
        super(props, context);
        
        this.state ={
            isEditable : false,
            name : "",
            description : ""
        };

        this.onToggleEditing = this.onToggleEditing.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.getName = this.getName.bind(this);
        this.getDescription = this.getDescription.bind(this);
    }

    onCancel(){
        this.setState({
            isEditable : false,
            name : this.props.app.name,
            description : this.props.app.description
        });
    }

    onSave(){
        this.setState({
            isEditable : false
        });

        this.props.onSave({
            key : this.props.app.key,
            appType: this.props.app.appType,
            name : this.getName(),
            description :this.getDescription(),
            isRetired : this.props.app.isRetired,
            tags : this.props.app.tags
        });
    }

    onToggleEditing(){
        this.setState({
            isEditable : !this.state.isEditable
        });
    }

    onNameChange(event) {
        this.setState({name: event.target.value});
      }

    onDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    getName(){
        return this.state.name === "" ? this.props.app.name : this.state.name;
    }

    getDescription(){
        return this.state.description === "" ? this.props.app.description : this.state.description;
    }

    render(){
        return (
            <AppSummary
            appKey={this.props.app.key}
            type={this.props.app.appType}
            name={this.getName()}
            description={this.getDescription()}
            editable={this.state.isEditable}            
            onClickEdit={this.onToggleEditing}
            onClickSave={this.onSave}
            onClickCancel={this.onCancel}
            onNameChange={this.onNameChange}
            onDescriptionChange={this.onDescriptionChange}
        />);
    }
}

AppSummaryContainer.propTypes = {
    app: PropTypes.object.isRequired,
    onSave : PropTypes.func.isRequired
};

export default AppSummaryContainer;
