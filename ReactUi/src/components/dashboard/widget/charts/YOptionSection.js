import React from 'react';
import PropTypes from 'prop-types';
import PropValue from '../../../common/PropValue';
import BrowserSelect from '../../../common/BrowserSelect';
import styled, { css } from 'styled-components';
import PropName from './../../../common/PropName';
import ToggleSelect from '../../../common/ToggleSelect';
import { AXIS_POSITION_LEFT, AXIS_POSITION_RIGHT, DEFAULT_COLORS } from './chart-constants';
import OptionInput from '../../../common/OptionInput';
import ColorPicker from '../../../common/ColorPicker';
import * as math from 'mathjs';

class YOptionSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.selectedOption
        };
    }

    getDefaultColour = () => {
        if (this.props.id <= DEFAULT_COLORS.length - 1) {
            return DEFAULT_COLORS[this.props.id];
        }

        return DEFAULT_COLORS[math.random(0, DEFAULT_COLORS.length)];
    }

    somethingChanged = e => {
        const { id, optionChanged } = this.props;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({ [e.target.name]: value });
        return optionChanged && optionChanged(e.target.name, value, id);
    }

    deleteYAxis = () => {
        const { id, deleteAxis } = this.props;
        return deleteAxis && deleteAxis(id);
    }
    isFunelChart=()=>{
        return this.state.type === 'funnel';
    }

    renderOptions() {
        return this.props.columnOptions && this.props.columnOptions.map(name => (<option key={name}>{name}</option>));
    }

    render() {
        return (
            <Wrapper id={'yAxis_' + this.props.id}>
                <OptionInput marginTop={'10px'}>
                    <PropName>Y axis</PropName>
                    <BrowserSelect name="y" onChange={this.somethingChanged} value={this.state.y || ''}>
                        <option value="" disabled> -- Please select -- </option>
                        {this.renderOptions()}
                    </BrowserSelect>
                    {(this.props.id === 0 && !this.isFunelChart()) && <HelperButton onClick={this.props.addAxis}>
                        <i className="fa fa-plus" aria-hidden="true" />
                    </HelperButton>}
                    {this.props.id > 0 && <HelperButton onClick={this.deleteYAxis}>
                        <i className="fa fa-trash-o" aria-hidden="true" />
                    </HelperButton>}
                </OptionInput>
                <OptionInput>
                    <PropName>Type</PropName>
                    <BrowserSelect name="type" onChange={this.somethingChanged} value={this.state.type}>
                        <option value="line">Line</option>
                        <option value="bar">Bar</option>
                        <option value="column">Column</option>
                        <option value="pie">Pie</option>
                        <option value="scatter">Scatter</option>
                        <option value="area">area</option>
                        <option value="timeseries">timeseries</option>
                        <option value="funnel">Funnel</option>
                    </BrowserSelect>
                </OptionInput>
                <OptionInput>
                    <PropName>Caption</PropName>
                    <PropValue name="caption" onChange={this.somethingChanged} value={this.state.caption} />
                </OptionInput>
                <OptionInput>
                    <PropName>Position</PropName>
                    <ToggleSelect name="position" option1={AXIS_POSITION_LEFT} option2={AXIS_POSITION_RIGHT} selectedOption={this.state.position} defaultOption={AXIS_POSITION_LEFT} onChange={this.somethingChanged} />
                </OptionInput>
                <OptionInput>
                    <PropName>Colour</PropName>
                    <ColorPicker name="color" onColorChanged={(name, value) => this.somethingChanged({ target: { name, value } })} color={this.state.color || this.getDefaultColour()} />
                </OptionInput>
            </Wrapper>
        );
    }
}

YOptionSection.propTypes = {
    id: PropTypes.number,
    optionChanged: PropTypes.func,
    deleteAxis: PropTypes.func,
    addAxis: PropTypes.func,
    columnOptions: PropTypes.array,
    selectedOption: PropTypes.object
};

const Wrapper = styled.div`
    border-bottom: 3px solid #ccc;
    margin-bottom: 4px;
    ${props => props.id === 'yAxis_0' && css`
        border-top: 3px solid #ccc;
    `};

    .aligned {
        position: relative;
    }
`;

const HelperButton = styled.button`
    height: 20px;
    font-size: 12px;
    margin-left: 10px;
    background-color: #262626;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-decoration: none;
`;

export default YOptionSection;