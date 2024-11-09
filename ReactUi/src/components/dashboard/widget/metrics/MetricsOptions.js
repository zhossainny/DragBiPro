/* eslint-disable jsx-quotes */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spacer from "../../../../components/common/Spacer";
import Select from "react-select";
import CheckInput from './../../../common/CheckInput';

class MetricsOptions extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedJsonProps: []
        };
        this.settingsChanged = this.settingsChanged.bind(this);
        this.checkboxChecked = this.checkboxChecked.bind(this);
        this.jsonPropertyChanged = this.jsonPropertyChanged.bind(this);
    }

    settingsChanged(e) {
        let name = e.target.name;
        let value = e.target.value;
        let copy = Object.assign({}, this.props.settings);
        copy[name] = value;
        this.props.onSettingsChanged(copy);
    }

    checkboxChecked(e) {
        let name = e.target.name;
        let value = e.target.checked;
        let copy = Object.assign({}, this.props.settings);
        copy[name] = value;
        this.props.onSettingsChanged(copy);
    }

    jsonPropertyChanged(selectedOption) {
        let copy = Object.assign({}, this.props.settings);
        copy['paths'] = selectedOption.map(option => option.value);
        this.props.onSettingsChanged(copy);
    }

    render() {
        let pathOptions = this.props.jsonProperties.map(i => { return { value: i, label: i }; });
        return (
            <div>
                <div style={{ whiteSpace: "nowrap" }}>
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Caption</PropName>
                    <PropValue placeholder=""
                        name="caption"
                        onChange={this.settingsChanged}
                        value={this.props.settings.caption} />
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Data Path</PropName>
                    <JsonPropertyList
                        isMulti
                        name='paths'
                        value={this.props.settings.paths}
                        onChange={this.jsonPropertyChanged}
                        options={pathOptions} />
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Type</PropName>
                    <DropDown onChange={this.settingsChanged}
                        name='type'
                        value={this.props.settings.type}>
                        <option value="numeric">Numeric</option>
                        <option value="text">Text</option>
                    </DropDown>
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Decimal places</PropName>
                    <PropValue placeholder=""
                        name="decimalPrecision"
                        onChange={this.settingsChanged}
                        value={this.props.settings.decimalPrecision} />
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Formatter</PropName>
                    <DropDown onChange={this.settingsChanged}
                        name='formatter'
                        value={this.props.settings.formatter}>
                        <option value="$">Dollar</option>
                        <option value="%">Percentage</option>
                        <option value="">None</option>
                    </DropDown>
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Font Size</PropName>
                    <DropDown onChange={this.settingsChanged}
                        name='fontSize'
                        value={this.props.settings.fontSize}>
                        <option value="l">Large</option>
                        <option value="m">Medium</option>
                        <option value="s">Small</option>
                    </DropDown>
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Format Numbers</PropName>
                    <CheckInput
                        position={'absolute'}
                        width={'10%'} type='checkbox'
                        name='formatNumbers'
                        className='widgetSettingCheckbox'
                        onChange={this.checkboxChecked}
                        checked={this.props.settings.formatNumbers}
                        value={this.props.settings.formatNumbers} />
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Colorize Numbers</PropName>
                    <CheckInput
                        position={'absolute'}
                        width={'10%'}
                        type='checkbox'
                        name='colorFormat'
                        className='widgetSettingCheckbox'
                        onChange={this.checkboxChecked}
                        checked={this.props.settings.colorFormat}
                        value={this.props.settings.colorFormat} />
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Invert Colors</PropName>
                    <CheckInput
                        position={'absolute'}
                        width={'10%'}
                        type='checkbox'
                        name='invertColors'
                        className='widgetSettingCheckbox'
                        onChange={this.checkboxChecked}
                        checked={this.props.settings.invertColors}
                        value={this.props.settings.invertColors} />
                </div>
            </div>);
    }
}

MetricsOptions.propTypes = {
    jsonProperties: PropTypes.array,
    settings: PropTypes.object,
    onSettingsChanged: PropTypes.func
};

const PropName = styled.label`
    margin-top: 5px;
    min-width: 100px;
    font-size:12px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
`;

const PropValue = styled.input`
    padding: 3px;
    width: 30%;
    min-width: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

const DropDown = styled.select`
    padding: 3px;
    width: 30%;
    min-width: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

const JsonPropertyList = styled(Select)`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    padding: 0px;
    width: 30%;
    min-width: 100px;
    display: inline-block;
    margin-bottom: -5px;
`;


export default MetricsOptions;
