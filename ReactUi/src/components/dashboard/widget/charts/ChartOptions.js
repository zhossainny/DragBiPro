import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PropValue from '../../../common/PropValue';
import BrowserSelect from '../../../common/BrowserSelect';
import Spacer from "../../../../components/common/Spacer";
import YOptionSection from './YOptionSection';
import PropName from './../../../common/PropName';
import MultiSelect from './../../../common/MultiSelect';
import { AXIS_POSITION_LEFT } from './chart-constants';
import BooleanToggle from '../../../common/BooleanToggle';
import * as _ from 'lodash';
import CollapsibleSectionContainer from './../../../common/CollapsibleSectionContainer';
import OptionInput from '../../../common/OptionInput';
import withChangeDetection from './../../../utils/OptionsWrapper';

class ChartOptions extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.yAxisChanged = this.yAxisChanged.bind(this);
    }

    additionalTooltipItemsChanged = items => {
        let copy = { ...this.props.settings, tooltip: { ...(this.props.settings.tooltip), additionalItems: items.map(x => x.value) } };
        this.props.onSettingsChanged(copy);
    }

    addYAxis = () => {
        let newOption = { y: '', type: 'line', caption: '', position: AXIS_POSITION_LEFT };
        let yAxisOptions = [...this.props.settings.yOptions, newOption];
        this.props.onSettingsChanged({ ...this.props.settings, yOptions: yAxisOptions });
    }

    deleteYAxis = index => {
        let copy = { ...this.props.settings };
        copy.yOptions.splice(index, 1);
        this.props.onSettingsChanged(copy);
    }

    yAxisChanged(propName, value, i) {
        let copy = { ...this.props.settings };
        copy.yOptions[i][propName] = value;
        this.props.onSettingsChanged(copy);
    }

    hasSettingEnabled = (propName, defaultValue = false) => {
        return this.props.settings[propName] && _.isBoolean(this.props.settings[propName].enabled) ? this.props.settings[propName].enabled : defaultValue;
    }

    getYAxisOptions(columnOptions) {
        let ySeries = this.props.settings.yOptions.map((option, i) =>
            (<YOptionSection
                key={i}
                id={i}
                optionChanged={this.yAxisChanged}
                deleteAxis={this.deleteYAxis}
                addAxis={this.addYAxis}
                columnOptions={columnOptions}
                selectedOption={option} />));
        return ySeries;
    }
    xChartType =()=>{
        if(this.props.settings.yOptions[0].type==='funnel')
            this.props.settings.enabled3d = false;
        return this.props.settings.yOptions[0].type;
    }
    render() {
        if (this.props.columnNames) {
            let sortedColumns = this.props.columnNames.sort();
            let tooltipItems = sortedColumns.map(x => ({ label: x, value: x }));
            let columnOptions = sortedColumns.map(columnName => (<option key={columnName}>{columnName}</option>));
            return (
                <Container>
                    <CollapsibleSectionContainer marginTop={'20px'} marginBottom={'10px'} headerText={'General'} expanded>
                        <PropName>Caption</PropName>
                        <PropValue placeholder=""
                            name="caption"
                            onChange={this.settingsChanged}
                            value={this.props.settings.caption} />
                    </CollapsibleSectionContainer>
                    <CollapsibleSectionContainer marginBottom={'10px'} headerText={'3D Chart/Angle'} expanded>
                        <OptionInput>
                            <PropName>3D Enable</PropName>
                            <BooleanToggle name="enabled3d" onChange={this.settingsChanged} checked={this.props.settings.enabled3d&&this.xChartType() !=='funnel'} />&nbsp;&nbsp;
                        </OptionInput>
                        <OptionInput>
                            <PropName>alpha (i.e: pie 45,others 0):</PropName>
                            <PropValue placeholder="" name="alpha" disabled={!this.props.settings.enabled3d} onChange={this.settingsChanged}  value={this.props.settings.alpha} />
                        </OptionInput>
                        <OptionInput>
                            <PropName>Beta (i.e: pie 0, others -30):</PropName>
                            <PropValue placeholder="" name="beta" disabled={!this.props.settings.enabled3d} onChange={this.settingsChanged}  value={this.props.settings.beta} />
                        </OptionInput>
                    </CollapsibleSectionContainer>
                    <CollapsibleSectionContainer marginBottom={'10px'} headerText={'Axes'} expanded>
                        <OptionInput>
                            <PropName>X axis</PropName>
                            <BrowserSelect name="x" onChange={this.settingsChanged} value={this.props.settings.x}>
                                <option value=""> -- Please select -- </option>
                                {columnOptions}
                            </BrowserSelect>
                        </OptionInput>
                        <OptionInput>
                            <PropName>Sort X axis</PropName>
                            <BooleanToggle name="sortXAxis" onChange={this.settingsChanged} checked={this.props.settings.sortXAxis} />
                        </OptionInput>


                        <OptionInput>
                            <PropName>Zoom <i className="fa fa-question-circle" data-toggle="tooltip" title="applicable to time series X axis only" /></PropName>
                            <BooleanToggle name="zoom.enabled" onChange={this.settingsChanged} checked={this.hasSettingEnabled('zoom')} />
                        </OptionInput>
                        {this.xChartType()!=='funnel' && <OptionInput>
                            <PropName>Series</PropName>
                            <BrowserSelect name="series" onChange={this.settingsChanged} value={this.props.settings.series}>
                                <option value=""> -- optional -- </option>
                                {columnOptions}
                            </BrowserSelect>
                        </OptionInput>}
                        {this.getYAxisOptions(sortedColumns)}
                    </CollapsibleSectionContainer>
                    <CollapsibleSectionContainer marginBottom={'10px'} headerText={'Tooltip'}>
                        <OptionInput>
                            <PropName>Split</PropName>
                            <BooleanToggle name="tooltip.split" onChange={this.settingsChanged} checked={this.props.settings.tooltip && this.props.settings.tooltip.split} />
                        </OptionInput>
                        <OptionInput>
                            <PropName>Decimal Places</PropName>
                            <PropValue placeholder=""
                                type="number"
                                name="tooltip.precision"
                                min="0"
                                onChange={this.settingsChanged}
                                value={this.props.settings.tooltip && this.props.settings.tooltip.precision} />
                        </OptionInput>
                        <OptionInput>
                            <PropName>Additional Fields</PropName>
                            <MultiSelect
                                width={'15%'}
                                minWidth={'200px'}
                                isMulti
                                value={_.has(this.props.settings, 'tooltip.additionalItems') && this.props.settings.tooltip.additionalItems.map(item => ({ label: item, value: item }))}
                                onChange={this.additionalTooltipItemsChanged}
                                options={tooltipItems} />
                        </OptionInput>
                    </CollapsibleSectionContainer>
                    <CollapsibleSectionContainer marginBottom={'10px'} headerText={'Legend'}>
                        <OptionInput>
                            <PropName>Enabled</PropName>
                            <BooleanToggle name="legend.enabled" onChange={this.settingsChanged} checked={this.hasSettingEnabled('legend', true)} />
                        </OptionInput>
                        <OptionInput>
                            <PropName>Item layout</PropName>
                            <BrowserSelect name="legend.layout" onChange={this.settingsChanged} value={(this.props.settings.legend && this.props.settings.legend.layout) || 'horizontal'}>
                                <option value="horizontal">horizontal</option>
                                <option value="vertical">vertical</option>
                            </BrowserSelect>
                        </OptionInput>
                        <OptionInput>
                            <PropName>Horizontal align</PropName>
                            <BrowserSelect name="legend.align" onChange={this.settingsChanged} value={(this.props.settings.legend && this.props.settings.legend.align) || 'center'}>
                                <option value="left">left</option>
                                <option value="center">center</option>
                                <option value="right">right</option>
                            </BrowserSelect>
                        </OptionInput>
                        <OptionInput>
                            <PropName>Vertical align</PropName>
                            <BrowserSelect name="legend.verticalAlign" onChange={this.settingsChanged} value={(this.props.settings.legend && this.props.settings.legend.verticalAlign) || 'bottom'}>
                                <option value="top">top</option>
                                <option value="middle">middle</option>
                                <option value="bottom">bottom</option>
                            </BrowserSelect>
                        </OptionInput>
                    </CollapsibleSectionContainer>
                    <CollapsibleSectionContainer marginBottom={'10px'} headerText={'Plot Lines'}>
                        <PropName>Enabled</PropName>
                        <BooleanToggle name="plotLines.enabled" onChange={this.settingsChanged} checked={this.hasSettingEnabled('plotLines')} />
                    </CollapsibleSectionContainer>
                    <CollapsibleSectionContainer headerText={'Crosshair'}>
                        <PropName>Enabled</PropName>
                        <BooleanToggle name="crosshair.enabled" onChange={this.settingsChanged} checked={this.hasSettingEnabled('crosshair')} />
                    </CollapsibleSectionContainer>
                </Container>
            );
        }

        return null;
    }
}

ChartOptions.propTypes = {
    settings: PropTypes.object,
    columnNames: PropTypes.array.isRequired,
    onSettingsChanged: PropTypes.func
};

const Container = styled.div`
    height: 100%;
    width: 100%;
`;

export default withChangeDetection(ChartOptions);
