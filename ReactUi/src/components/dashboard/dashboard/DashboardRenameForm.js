/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import '../../../css/dashboard.css';
import Modal from "../../common/Modal";
import FormField from "../../common/FormField";

class DashboardRenameForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dashboardName: null
        };

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.dashboardNameChanged = this.dashboardNameChanged.bind(this);
    }

    componentDidUpdate() {
        if (this.state.dashboardName === null)
            this.setState({dashboardName: this.props.dashboardName});
    }

    onOk() {
        this.props.onOk(this.state.dashboardName);
        this.setState({dashboardName: null});
    }

    onCancel() {
        this.props.onCancel(this.props.name);
        this.setState({dashboardName: null});
    }

    dashboardNameChanged(event) {
        this.setState({dashboardName: event.target.value});
    }

    render() {
        return (
            <Modal show={this.props.show}
                   onOK={this.onOk}
                   onCancel={this.onCancel}>
                <div style={{paddingLeft: '20px'}}>
                    <FormField label={"Name"}>
                        <Label/>
                        <InputText onChange={this.dashboardNameChanged}
                                   value={this.state.dashboardName}/>
                    </FormField>
                </div>
            </Modal>
        );
    }
}

DashboardRenameForm.propTypes = {
    show: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    dashboardName: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

const Label = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-bottom:5px;

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


export default DashboardRenameForm;

