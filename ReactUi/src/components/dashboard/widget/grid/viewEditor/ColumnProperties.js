import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spacer from "../../../../common/Spacer";
import ColorPicker from "../../../../common/ColorPicker";
import PropName from './../../../../common/PropName';
import BooleanToggle from './../../../../common/BooleanToggle';
import OptionInput from '../../../../common/OptionInput';
import PropValue from './../../../../common/PropValue';

class ColumnProperties extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    columnPropertyChanged = e => {
        this.props.onPropertiesChanged({ ...this.props.columnProperties, [e.target.name]: e.target.value, dirty: true });
    }

    colorChangedHandler = (name, color) => {
        this.props.onPropertiesChanged({ ...this.props.columnProperties, [name]: color, dirty: true });
    }

    render() {
        let multiSelection = this.props.selectedColumns.length > 1;
        let activeColumnCaption = multiSelection ?
            this.props.selectedColumns.length + ' columns' :
            this.props.selectedColumns[0];

        return (
            <ColumnPropertiesContainer>
                <Spacer horizontalSpacing={0} verticalSpacing={10} />
                <PropHeader>Editing: {activeColumnCaption}</PropHeader>
                {!multiSelection &&
                    <OptionInput marginTop={'10px'}>
                        <PropName>Caption</PropName>
                        <Input placeholder=""
                            name="caption"
                            onChange={this.columnPropertyChanged}
                            value={this.props.columnProperties.caption}
                        />
                    </OptionInput>
                }
                {this.props.selectedColumns[0] !== 'Group' &&
                    <OptionInput>
                        <PropName>Column Type</PropName>
                        <TextDropDown value={this.props.columnProperties.type}
                            name={'type'}
                            onChange={this.columnPropertyChanged}>
                            <option value="text">Text</option>
                            <option value="numeric">Numeric</option>
                            <option value="date">Date Time</option>
                            <option value="percentage">Percentage</option>
                        </TextDropDown>
                    </OptionInput>
                }
                {this.props.columnProperties.type === 'date' &&
                    <OptionInput>
                        <PropName>Date Format</PropName>
                        <Input placeholder=""
                            value={this.props.columnProperties.dateFormat}
                            onChange={this.columnPropertyChanged}
                            name="dateFormat" />
                    </OptionInput>
                }
                {(this.props.columnProperties.type === 'numeric' || this.props.columnProperties.type === 'percentage') &&
                    <OptionInput>
                        <PropName>Decimal Places</PropName>
                        <Input placeholder=""
                            value={this.props.columnProperties.decimalPrecision}
                            onChange={this.columnPropertyChanged}
                            name="decimalPrecision" />
                    </OptionInput>
                }
                <OptionInput>
                    <PropName>Font Size</PropName>
                    <Input placeholder="e.g. 12"
                        name="fontSize"
                        onChange={this.columnPropertyChanged}
                        value={this.props.columnProperties.fontSize}
                    />
                </OptionInput>
                <OptionInput>
                    <PropName>Font Style</PropName>
                    <TextDropDown
                        name="fontStyle"
                        onChange={this.columnPropertyChanged}
                        value={this.props.columnProperties.fontStyle}>
                        <option value="normal">Normal</option>
                        <option value="500">Bolder</option>
                        <option value="bold">Bold</option>
                        <option value="italic">Italic</option>
                    </TextDropDown>
                </OptionInput>
                <OptionInput>
                    <PropName>Format USD</PropName>
                    <BooleanToggle name="formatDollar" checked={this.props.columnProperties.formatDollar} onChange={this.columnPropertyChanged} />
                </OptionInput>
                {(this.props.columnProperties.type === 'numeric' || this.props.columnProperties.type === 'percentage') &&
                    <React.Fragment>
                        <OptionInput>
                            <PropName>Data Bar</PropName>
                            <BooleanToggle name="dataBar" checked={this.props.columnProperties.dataBar} onChange={this.columnPropertyChanged} />
                        </OptionInput>
                        <OptionInput>
                            <PropName>Absolute Sort</PropName>
                            <BooleanToggle name="absoluteSort" checked={this.props.columnProperties.absoluteSort} onChange={this.columnPropertyChanged} />
                        </OptionInput>
                    </React.Fragment>
                }
                <OptionInput>
                    <PropName>Font Color</PropName>
                    <ColorPicker onColorChanged={this.colorChangedHandler}
                        name={'color'}
                        color={this.props.columnProperties.color} />
                </OptionInput>
                <OptionInput>
                    <PropName>Background</PropName>
                    <ColorPicker onColorChanged={this.colorChangedHandler}
                        name={'backgroundColor'}
                        color={this.props.columnProperties.backgroundColor} />
                </OptionInput>
            </ColumnPropertiesContainer>);
    }
}

ColumnProperties.propTypes = {
    selectedColumns: PropTypes.array,
    columnProperties: PropTypes.object,
    onPropertiesChanged: PropTypes.func
};

const Input = styled(PropValue)`
    min-width: 100px;
    width: unset;
    background:#262626;
    color:white;
`;

const TextDropDown = styled.select`
    padding: 3px;
    min-width: 147px;
    display: inline-block;
    border: 1px solid #ccc; 
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    background:#262626;
    color:white;
`;

const ColumnPropertiesContainer = styled.div`
    margin: 10px 0px 20px 30px;
    background:#262626;
    color:white;
`;

const PropHeader = styled.label`
    margin-top: 5px;
    min-width: 100px;
    font-size:12px;
    font-weight: 500;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    background:#262626;
    color:white; 
`;

export default ColumnProperties;