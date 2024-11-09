/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import '../../css/dashboard.css';
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import Spacer from "../common/Spacer";
import FormCaption from  '../common/FormCaption';

class FileUploadForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dirName: null,
            currentDir: true
        };

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.dirNameChanged = this.dirNameChanged.bind(this);
        this.checkboxChecked = this.checkboxChecked.bind(this);
    }

    onOk() {
        this.props.onOk(this.state.dirName);
        this.setState({dirName: null});
    }

    onCancel() {
        this.props.onCancel();
        this.setState({dirName: null});
    }

    dirNameChanged(event) {
        this.setState({dirName: event.target.value});
    }

    checkboxChecked(e) {
        let value = e.target.checked;
        this.setState({currentDir: value});
    }

    render() {
        return (
            <Modal show={this.props.show}
                   onOK={this.onOk}
                   onCancel={this.onCancel}>
                <FormCaption>Upload Destination</FormCaption>
                <Spacer verticalSpacing={15} horizontalSpacing={0}/>
                <ControlContainer style={{paddingLeft: '20px'}}>
                    <input type="checkbox"
                           id="dirCheck"
                           checked={this.state.currentDir}/>
                    <CheckBoxLabel htmlFor="dirCheck"
                                   onChange={this.checkboxChecked}
                                   style={{marginLeft: '5px'}}>Current Directory</CheckBoxLabel>
                    <FormField label={"New Directory Name"} style={{marginTop: '10px'}}>
                        <InputText onChange={this.dirNameChanged}
                                   placeholder={'Optional'}
                                   value={this.state.dirName}/>
                    </FormField>
                </ControlContainer>
            </Modal>
        );
    }
}

FileUploadForm.propTypes = {
    show: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

const CheckBoxLabel = styled.label`
    font-size:13px;
    font-weight: 400 !important;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

const ControlContainer = styled.div`
    font-size:13px;
    font-weight: 400;
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

export default FileUploadForm;

