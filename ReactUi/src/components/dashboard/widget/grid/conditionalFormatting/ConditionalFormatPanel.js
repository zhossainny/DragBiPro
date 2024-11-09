import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spacer from "../../../../common/Spacer";
import Select from "react-select";
import {shortUid} from "../../../../../functions/utils";
import ColorPicker from "../../../../common/ColorPicker";
import ConditionalEntry from "./ConditionalEntry";

class ConditionalFormatPanel extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            conditionalFormat: null
        };

        this.addNewCondition = this.addNewCondition.bind(this);
        this.buildEntries = this.buildEntries.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.formatChanged = this.formatChanged.bind(this);
        this.conditionTypeChanged = this.conditionTypeChanged.bind(this);
        this.colorChangedHandler = this.colorChangedHandler.bind(this);
    }

    componentDidMount() {
        if (!this.state.conditionalFormat && this.props.conditionalFormat) {
            this.setState({conditionalFormat: this.props.conditionalFormat});
        }
    }

    componentDidUpdate() {
        if (!this.state.conditionalFormat && this.props.conditionalFormat) {
            this.setState({conditionalFormat: this.props.conditionalFormat});
        }
    }

    addNewCondition() {
        let formatCopy = Object.assign({}, this.state.conditionalFormat);
        formatCopy.entries.push({value: null, condition: null, id: shortUid()});
        this.setState({conditionalFormat: formatCopy});
        this.props.onConditionalFormatChanged(formatCopy);
    }

    formatChanged(format) {
        this.setState({conditionalFormat: format});
        this.props.onConditionalFormatChanged(format);
    }

    colorChangedHandler(name, color) {
        let formatCopy = Object.assign({}, this.state.conditionalFormat);
        formatCopy[name] = color;
        this.setState({conditionalFormat: formatCopy});
        this.props.onConditionalFormatChanged(formatCopy);
    }

    nameChanged(e) {
        let value = e.target.value;
        let formatCopy = Object.assign({}, this.state.conditionalFormat);
        formatCopy.name = value;
        this.setState({conditionalFormat: formatCopy});
        this.props.onConditionalFormatChanged(formatCopy);
    }

    conditionTypeChanged(e) {
        let value = e.target.value;
        let formatCopy = Object.assign({}, this.state.conditionalFormat);
        formatCopy.type = value;
        this.setState({conditionalFormat: formatCopy});
        this.props.onConditionalFormatChanged(formatCopy);
    }

    buildEntries() {
        return this.state.conditionalFormat.entries.map((entry, i) => {
            return (
                <ConditionalEntry counter={i}
                                  entry={entry}
                                  columnNames={this.props.columnNames}
                                  onConditionalFormatChanged={this.formatChanged}
                                  conditionalFormat={this.state.conditionalFormat}/>
            );
        });
    }

    render() {
        if (!this.state.conditionalFormat) return null;
        return (
            <ConditionalFormatContainer>
                <div style={{whiteSpace: "nowrap"}}>
                    <PropHeader>Column: {this.props.selectedColumn}</PropHeader>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <PropName>Name</PropName>
                    <InputText name="name"
                               value={this.state.conditionalFormat.value}
                               placeholder={'Optional title'}
                               onChange={this.nameChanged}/>
                    <Spacer horizontalSpacing={0} verticalSpacing={20}/>
                    <GroupName>Conditions</GroupName>
                    <div style={{marginTop:'5px'}}>
                        <RadioButtonContainer>
                            <input type="radio"
                                   id="orRadion"
                                   name="conditionType"
                                   onChange={this.conditionTypeChanged}
                                   value="or"
                                   checked={this.state.conditionalFormat.type === 'or'}/>
                            <RadioButtonLabel htmlFor="orRadion">OR</RadioButtonLabel>
                        </RadioButtonContainer>
                        <RadioButtonContainer>
                            <input type="radio"
                                   id="andRadio"
                                   name="conditionType"
                                   onChange={this.conditionTypeChanged}
                                   value="and"
                                   checked={this.state.conditionalFormat.type === 'and'}
                            />
                            <RadioButtonLabel htmlFor="andRadio">AND</RadioButtonLabel>
                        </RadioButtonContainer>
                    </div>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <EntryContainer style={{overflow: this.state.conditionalFormat.entries.length > 2 ? 'auto' : 'unset'}}>
                        {this.buildEntries()}
                    </EntryContainer>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <button className="header-button"
                            onClick={this.addNewCondition}
                            style={{float: 'inherit', background:'#F15C25',
                                height: '18px'}}>
                        Add Another Condition
                    </button>
                    <Spacer horizontalSpacing={0} verticalSpacing={20}/>
                    <GroupName>Formatting</GroupName>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <PropName>Font Color</PropName>
                    <ColorPicker onColorChanged={this.colorChangedHandler}
                                 name={'color'}
                                 color={this.state.conditionalFormat.color}/>
                    <Spacer horizontalSpacing={0} verticalSpacing={10}/>
                    <PropName>Background</PropName>
                    <ColorPicker onColorChanged={this.colorChangedHandler}
                                 name={'backgroundColor'}
                                 color={this.state.conditionalFormat.backgroundColor}/>
                </div>
        </ConditionalFormatContainer>);
    }
}

ConditionalFormatPanel.propTypes = {
    columnNames: PropTypes.array,
    conditionalFormat: PropTypes.object,
    selectedColumn: PropTypes.string,
    onPropertiesChanged: PropTypes.func,
    onConditionalFormatChanged: PropTypes.func
};

const PropName = styled.label`
    margin-top: 5px;
    min-width: 70px;
    font-size:12px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;   
`;

const RadioButtonLabel = styled.label`
    font-size:12px;
    width: 20px;
    margin-top: 5px;   
    margin-left: 5px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;   
`;

const PropHeader = styled.label`
    margin-top: 5px;
    min-width: 100px;
    font-size:12px;
    font-weight: 500;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;   
`;

const RadioButtonContainer = styled.div`
    margin: 0px 10px 0px 0px;
    display: inline;
`;

const EntryContainer = styled.div`
    max-height: 230px;    
    color:white;
`;

const GroupName = styled(PropName)`
    font-weight: 500;
`;

const InputText = styled.input`
    padding: 3px;
    width: 60%;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;
`;

const ConditionalFormatContainer = styled.div`
    margin: 10px 0px 20px 15px;
`;

export default ConditionalFormatPanel;