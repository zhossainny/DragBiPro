/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import '../../../css/dashboard.css';
import Modal from "../../common/Modal";
import FormField from "../../common/FormField";
import ConfigItemValue from './ConfigItemValue';
import * as _ from 'lodash';
import { shortUid } from './../../../functions/utils';

class NewConfigurationItemForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.defaultState = {
            name: null,
            type: 'text',
            options: [],
            error: null,
            version: -1,
            id: null
        };
        this.state = { ...this.defaultState };
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.deleteItemHandler = this.deleteItemHandler.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.item && this.state.version !== this.props.item.version) {
            this.setState({ ...this.props.item });
        }
    }

    onOk() {
        let error = this.validateForm();
        if (error) {
            this.setState({ error: error });
        } else {
            this.props.onOk(this.buildConfigItem(), this.state.version > -1);
            this.reset();
        }
    }

    onCancel() {
        this.props.onCancel(this.props.name);
        this.reset();
    }

    deleteItemHandler() {
        this.props.deleteItem(this.state.id);
        this.reset();
    }

    buildConfigItem() {
        const { error, ...configItem } = this.state;
        return { ...configItem, version: configItem.version + 1, id: !configItem.id ? shortUid() : configItem.id };
    }

    reset() {
        this.setState({ ...this.defaultState });
    }

    validateForm() {
        if (!this.state.name) {
            return "Please provide a name";
        }
        if (!this.state.value) {
            return "Value cannot be null";
        }
        return null;
    }

    inputChanged = e => {
        let input = e.target.name;
        let value = e.target.value;
        if (input === 'type') {
            if (value === 'checkList') {
                if (this.state.type === 'dropDown') {
                    this.setState(prevState => {
                        return { options: prevState.options.map(option => ({ selected: true, value: option })) };
                    });
                }
            }
            if (value === 'dropDown') {
                if (this.state.type === 'checkList') {
                    console.log('setting state');
                    this.setState(prevState => {
                        return { options: prevState.options.map(option => option.value) };
                    });
                }
            }
        }
        this.setState({ [input]: value });
    }

    valueChanged = (value) => {
        if (this.state.type === 'text') {
            this.setState({ value });
        }
        if (this.state.type === 'checkList') {
            this.setState({ value, options: value.split(',').map(val => ({ selected: true, value: val })) });
        }
        if (this.state.type === 'dropDown') {
            let values = value.split(',');
            this.setState({ value: values.length ? values[0] : null, options: values });
        }
    }

    render() {
        return (
            <Modal show={this.props.show}
                onOK={this.onOk}
                onCancel={this.onCancel}>
                {this.state.id && <button className="dash-config-small-button"
                    style={{
                        marginRight: '20px',
                        fontSize: '14px',
                        width: '30px',
                        float: 'right'
                    }}
                    onClick={this.deleteItemHandler}>
                    <i className="fa fa-trash-o" />
                </button>}
                <div style={{ paddingLeft: '20px' }}>
                    <FormField label="Name">
                        <InputText name="name"
                            onChange={this.inputChanged}
                            value={this.state.name} />
                    </FormField>
                    <FormField label="Type">
                        <ComboBox name="type"
                            value={this.state.type}
                            onChange={this.inputChanged}>
                            <option value="text">Text</option>
                            <option value="dropDown">Drop Down</option>
                            <option value="checkList">List</option>
                        </ComboBox>
                    </FormField>
                    <FormField label="Value">
                        <LabelDescribe>(Use line breaks to separate items)</LabelDescribe>
                        <ConfigItemValue value={this.state.value} onChange={this.valueChanged} options={this.state.options} type={this.state.type} />
                    </FormField>
                    {this.state.error && <ErrorText>{this.state.error}</ErrorText>}
                </div>
            </Modal>
        );
    }
}

NewConfigurationItemForm.propTypes = {
    show: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    deleteItem: PropTypes.func,
    item: PropTypes.object
};

const Label = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-bottom:5px;

`;

const LabelDescribe = styled.span` 
    font-size:11px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: darkgray;
    margin-bottom:5px;
    margin-left:5px;
`;

const ErrorText = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: red;
    margin-top:15px;
    text-align: center;
    margin-left: -20px;
`;

const ComboBox = styled.select`
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


const TextBox = styled.textarea`
    padding: 8px 15px;
    margin: 0px 0;
    width: 300px;
    min-height: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
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


export default NewConfigurationItemForm;

