import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spacer from "../../../../components/common/Spacer";
import Select from "react-select";

class PercentagePieOptions extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedJsonProps: []
        };
        this.jsonPropertyChanged = this.jsonPropertyChanged.bind(this);
        this.settingsChanged = this.settingsChanged.bind(this);
    }

    jsonPropertyChanged(selectedOption){
        let copy = Object.assign({}, this.props.settings);
        copy['path'] = selectedOption.value;
        this.props.onSettingsChanged(copy);
    }

    settingsChanged(e) {
        let name = e.target.name;
        let value = e.target.value;
        let copy = Object.assign({}, this.props.settings);
        copy[name] = value;
        this.props.onSettingsChanged(copy);
    }

    render() {
        let pathOptions = this.props.jsonProperties.map(i=> {return  {value: i, label:i};});
        return (
            <div>
                <div style={{whiteSpace: "nowrap"}}>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <PropName>Caption</PropName>
                    <PropValue placeholder=""
                               name="caption"
                               onChange={this.settingsChanged}
                               value={this.props.settings.caption}/>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <PropName>Data Path</PropName>
                    <JsonPropertyList
                        name="paths"
                        value={this.props.settings.path}
                        onChange={this.jsonPropertyChanged}
                        options={pathOptions}/>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                </div>
            </div>);
    }
}

PercentagePieOptions.propTypes = {
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

const JsonPropertyList = styled(Select)`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    padding: 0px;
    width: 30%;
    min-width: 100px;
    display: inline-block;
    margin-top: 5px;
    margin-bottom: -10px;
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

export default PercentagePieOptions;
