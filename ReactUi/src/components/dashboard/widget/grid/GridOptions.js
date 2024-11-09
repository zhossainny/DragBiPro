import React from 'react';
import PropTypes from 'prop-types';
import PropName from './../../../common/PropName';
import PropValue from '../../../common/PropValue';
import BrowserSelect from './../../../common/BrowserSelect';
import BooleanToggle from './../../../common/BooleanToggle';
import OptionInput from '../../../common/OptionInput';
import CollapsibleSectionContainer from './../../../common/CollapsibleSectionContainer';
import { getSortedCopy } from './../../../../functions/dashboard/agGridUtils';
import * as _ from 'lodash';
import withChangeDetection from './../../../utils/OptionsWrapper';

class GridOptions extends React.Component {

    constructor(props, context) {
        super(props, context);
        if (props.settings.showTotals && !props.settings.totals) {
            props.settings.totals = { enabled: true };
        }
    }

    render() {
        return (
            <div>
                <CollapsibleSectionContainer marginTop="20px" marginBottom="10px" headerText="General" expanded>
                    <OptionInput marginTop={'10px'}>
                        <PropName>Caption</PropName>
                        <PropValue
                            name="caption"
                            type="text"
                            onChange={this.settingsChanged}
                            value={this.props.settings.caption} />
                    </OptionInput>
                    <OptionInput>
                        <PropName>Font Size</PropName>
                        <BrowserSelect name="fontSize"
                            onChange={this.settingsChanged}
                            value={this.props.settings.fontSize}>
                            <option value="xs">Tiny</option>
                            <option value="x">Small</option>
                            <option value="m">Normal</option>
                            <option value="l">Large</option>
                        </BrowserSelect>
                    </OptionInput>
                    <OptionInput>
                        <PropName>Decimal Places</PropName>
                        <PropValue placeholder=""
                            name="decimalPrecision"
                            type="number"
                            min="0"
                            onChange={this.settingsChanged}
                            value={this.props.settings.decimalPrecision} />
                    </OptionInput>
                    <OptionInput>
                        <PropName>Row Height</PropName>
                        <PropValue placeholder=""
                            name="rowHeight"
                            type="number"
                            min="0"
                            onChange={this.settingsChanged}
                            value={this.props.settings.rowHeight} />
                    </OptionInput>
                    <OptionInput>
                        <PropName>Format USD</PropName>
                        <BooleanToggle name="formatDollar" onChange={this.settingsChanged} checked={this.props.settings.formatDollar} />
                    </OptionInput>
                    <OptionInput>
                        <PropName>Column order from data source <i className="fa fa-question-circle" data-toggle="tooltip" title="Applies column order from data source. When ticked this will ignore any column order you might have saved as part of the grid settings." /></PropName>
                        <BooleanToggle name="columnOrderFromServer" onChange={this.settingsChanged} checked={this.props.settings.columnOrderFromServer} />
                    </OptionInput>
                </CollapsibleSectionContainer>
                <CollapsibleSectionContainer marginTop="10px" marginBottom="10px" headerText="Totals">
                    <OptionInput>
                        <PropName>Enabled</PropName>
                        <BooleanToggle name="totals.enabled" onChange={this.settingsChanged} checked={this.props.settings.totals && this.props.settings.totals.enabled} />
                    </OptionInput>
                    {this.props.settings.totals && this.props.settings.totals.enabled &&
                        <OptionInput>
                            <PropName>Pin To Bottom</PropName>
                            <BooleanToggle name="totals.pinToBottom" onChange={this.settingsChanged} checked={this.props.settings.totals.pinToBottom} />
                        </OptionInput>}
                </CollapsibleSectionContainer>
                <CollapsibleSectionContainer marginTop="10px" marginBottom="10px" headerText="Row Model" >
                    <OptionInput>
                        <PropName>Tree Data</PropName>
                        <BooleanToggle name="treeData.enabled" onChange={this.settingsChanged} checked={this.props.settings.treeData && this.props.settings.treeData.enabled} />
                    </OptionInput>
                    {this.props.settings.treeData && this.props.settings.treeData.enabled && this.props.columnNames &&
                        <OptionInput>
                            <PropName>Path Property</PropName>
                            <BrowserSelect name="treeData.pathProperty"
                                onChange={this.settingsChanged}
                                value={this.props.settings.treeData.pathProperty}>
                                {getSortedCopy(this.props.columnNames.map(column => (<option key={column} value={column}>{column}</option>)))}
                            </BrowserSelect>
                        </OptionInput>}
                </CollapsibleSectionContainer>
            </div>);
    }
}

GridOptions.propTypes = {
    settings: PropTypes.object,
    onSettingsChanged: PropTypes.func,
    columnNames: PropTypes.array
};

export default withChangeDetection(GridOptions);
