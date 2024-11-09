/* eslint-disable react/no-did-mount-set-state,react/jsx-boolean-value */
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import '../../../css/dashboard.css';
import Modal from "../../common/Modal";
import FormField from "../../common/FormField";

class DashboardAutoRefreshForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            interval: null
        };

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.valueChanged = this.valueChanged.bind(this);
    }

    componentDidMount() {
        if (!this.state.interval)
            this.setState({interval: this.props.currentInterval});
    }

    onOk() {
        this.props.onOk(this.state.interval);
        this.setState({interval: null});
    }

    onCancel() {
        this.props.onCancel(this.props.name);
        this.setState({interval: null});
    }

    valueChanged(event) {
        this.setState({interval: +event.target.value});
    }

    render() {
        return (
            <Modal  show={true}
                    onOK={this.onOk}
                   onCancel={this.onCancel}>
                <div style={{paddingLeft: '20px'}}>
                    <FormField label={"Interval (seconds)"}>
                        <Label/>
                        <InputText type="number" onChange={this.valueChanged}
                                   value={this.state.interval}/>
                    </FormField>
                </div>
            </Modal>
        );
    }
}

DashboardAutoRefreshForm.propTypes = {
    currentInterval: PropTypes.number,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    name: PropTypes.string
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


export default DashboardAutoRefreshForm;

