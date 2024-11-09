/* eslint-disable react/no-did-update-set-state */
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {bindActionCreators} from "redux";
import * as widgetActions from "../../../actions/dashboardWidgetActions";
import '../../../css/dashboard.css';
import Modal from "../../common/Modal";
import FormField from "../../common/FormField";
import * as constants from "../../../configuration/constants";
import * as config from "../../../configuration/config";
import fetch from "isomorphic-fetch";
import { Creatable } from 'react-select';

class DashboardSaveForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dashboardName: null,
            tag: null,
            key: null,
            error: null,
            validating: false
        };

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tagChanged = this.tagChanged.bind(this);
        this.dashboardNameChanged = this.dashboardNameChanged.bind(this);
        this.dashboardKeyChanged = this.dashboardKeyChanged.bind(this);
    }

    componentDidUpdate() {
        if (this.state.dashboardName === null)
            this.setState({dashboardName: this.props.dashboardName});
        if (this.state.tag === null && this.props.tag)
            this.setState({tag: this.props.tag});
    }

    onOk() {
        this.setState({
            validating: true
        });
        let error = this.validateForm();
        if (error) {
            this.setState({error: error});
        } else {
            this.checkKeyExists();
        }
    }

    onCancel() {
        this.props.onCancel(this.props.name);
        this.setState({
            dashboardName: null,
            tag: null,
            error: null,
            validating: false
        });
    }

    save() {
        this.props.onSave(this.state.key, this.state.dashboardName, this.state.tag);
        this.setState({
            dashboardName: null,
            tag: null
        });
    }

    dashboardKeyChanged(event) {
        let adjustedKey = event.target.value.replace(" ", "-");
        this.setState({
            key: adjustedKey,
            error: null
        });
    }

    dashboardNameChanged(event) {
        this.setState({
            dashboardName: event.target.value,
            error: null
        });
    }

    tagChanged(selection) {
        this.setState({
            tag: selection ? selection.value : null
        });
    }

    validateForm() {
        if (this.state.dashboardName === constants.UNTITLED_DASHBOARD_NAME || !this.state.dashboardName) {
            return "Please provide a better name";
        }
        if (!this.state.key) {
            return "Please provide a valid key";
        }
        return null;
    }

    checkKeyExists() {
        let _this = this;
        _this.save();
        // fetch(config.getAppsUri() + "/" + this.state.key, {
        //
        //     method: 'HEAD'
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         _this.setState({
        //             error: "Sorry. Looks like this key already exists.",
        //             validating: false
        //         });
        //         return;
        //     }
        //     _this.save();
        // });
    }

    getAppTags() {
        let tags = [];
        if (!this.props.apps) return tags;
        for (let app of this.props.apps) {
            if (app && app.tags && app.tags.tag) {
                tags.push(app.tags.tag);
            }
        }
        if (this.state.tag)
            tags.push(this.state.tag);
        return tags;
    }

    render() {
        let tags = this.getAppTags();
        let tagOptions = tags.map(tag => {return {label: tag, value: tag}});
        return (
            <Modal show={this.props.show}
                   onOK={this.onOk}
                   onCancel={this.onCancel}>
                <Label>{this.props.caption}</Label>
                <div style={{paddingLeft: '20px'}}>
                    <FormField label={"Name"}>
                        <InputText onChange={this.dashboardNameChanged}
                                   value={this.state.dashboardName}/>
                    </FormField>
                    <FormField label={"Key"}>
                        <LabelDescribe>Name and Key could be the same, but needs uniqueness</LabelDescribe>
                        <InputText onChange={this.dashboardKeyChanged} value={this.state.key}/>
                    </FormField>
                    {this.state.error && <ErrorText>{this.state.error}</ErrorText>}
                </div>
            </Modal>
        );
    }
}

DashboardSaveForm.propTypes = {
    show: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    dashboardName: PropTypes.string.isRequired,
    caption: PropTypes.string,
    tag: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

const Label = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-bottom:5px;
`;

const ErrorText = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: red;
    margin-top:15px;
    text-align: center;
    margin-left: -20px;
`;

const TagList = styled(Creatable) `
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    width:300px;
`;

const LabelDescribe = styled.span` 
    font-size:11px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: darkgray;
    margin-bottom:5px;
    margin-left:5px;
`;

const InputText = styled.input`
    padding: 8px 15px;
    margin: 0px 0;
    width: 300px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

function mapStateToProps(state) {
    return {
        widgetControls: state.dashboard.widgetControls,
        apps: state.apps
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...widgetActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSaveForm);

