import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spacer from "../../../components/common/Spacer";
import Select from "react-select";
import PropName from './../../common/PropName';
import MultiSelect from './../../common/MultiSelect';

class AdvancedOptions extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.masterWidgetChanged = this.masterWidgetChanged.bind(this);
        this.masterDetailFieldChanged = this.masterDetailFieldChanged.bind(this);
        this.configItemChanged = this.configItemChanged.bind(this);
        this.configFieldChanged = this.configFieldChanged.bind(this);
        this.addNewConfigFilter = this.addNewConfigFilter.bind(this);
    }

    masterDetailFieldChanged(selectedOption) {
        let copy = Object.assign({}, this.props.settings);
        if (!copy.dataFilter) {
            copy.dataFilter = {};
        }
        copy.dataFilter.field = selectedOption ? selectedOption.value : null;
        this.props.onSettingsChanged(copy);
    }

    masterWidgetChanged(selectedOption) {
        let copy = Object.assign({}, this.props.settings);
        if (!selectedOption || !selectedOption.value) {
            copy.dataFilter = {};
            copy.masterWidget = null;
        } else {
            copy.masterWidget = selectedOption.value;
        }
        this.props.onSettingsChanged(copy);
    }

    configFieldChanged(selectedOption, i) {
        let copy = Object.assign({}, this.props.settings);
        copy.configurationFilters[i].field = selectedOption.value;
        this.props.onSettingsChanged(copy);
    }

    configItemChanged(selectedOption, i) {
        let copy = Object.assign({}, this.props.settings);
        copy.configurationFilters[i].configItemName = selectedOption.value;
        let configItem = this.props.configItems.find(x => x.name === selectedOption.value);
        copy.configurationFilters[i].value = configItem.value;
        this.props.onSettingsChanged(copy);
    }

    buildConfigurationFilters(dataFields) {
        let configNames = this.props.configItems.map(x => ({ label: x.name, value: x.name }));
        let filters = this.props.settings.configurationFilters ?
            this.props.settings.configurationFilters : [{ configItemName: null, field: null, value: null }];
        return filters.map((filter, i) => {
            filter.key = i;
            return (<div key={i}>
                <PropName>Config Item</PropName>
                <MultiSelect
                    width={'30%'}
                    name={i}
                    value={{ label: filter.configItemName, value: filter.configItemName}}
                    onChange={e => this.configItemChanged(e, i)}
                    options={configNames} />
                <Spacer horizontalSpacing={0} verticalSpacing={10} />
                <PropName>Filtered Property</PropName>
                <MultiSelect
                    width={'30%'}
                    name={i}
                    value={{ label: filter.field, value: filter.field}}
                    onChange={e => this.configFieldChanged(e, i)}
                    options={dataFields} />
                <button className="header-button"
                    onClick={() => this.deleteConfigFilter(i)}
                    style={{
                        float: 'inherit',
                        height: '20px',
                        fontSize: '12px',
                        position: 'absolute',
                        marginTop: '4px',
                        marginLeft: '10px'
                    }}>
                    <i className="fa fa-trash-o" aria-hidden="true" />
                </button>
                <Spacer horizontalSpacing={0} verticalSpacing={30} />
            </div>
            );
        });
    }

    deleteConfigFilter(index) {
        let copy = Object.assign({}, this.props.settings);
        copy.configurationFilters = copy.configurationFilters.filter(x => x.key !== index);
        this.props.onSettingsChanged(copy);
    }

    addNewConfigFilter() {
        let copy = Object.assign({}, this.props.settings);
        copy.configurationFilters.push({
            configItemName: null,
            field: null,
            value: null
        });
        this.props.onSettingsChanged(copy);
    }

    resolveWidgetLabel = widgetId => {
        if(widgetId && this.props.widgets[widgetId]) {
            return this.props.widgets[widgetId].title;
        }
    }

    render() {
        let dataFields = this.props.settings.columnNames.map(x => ({ label: x, value: x }));
        let widgets = [];
        Object.getOwnPropertyNames(this.props.widgets).forEach(id => {
            let widgetTitle = this.props.widgets[id].title;
            if (id !== this.props.id && widgetTitle) {
                widgets.push({ label: widgetTitle, value: id });
            }
        });
        widgets.push({ label: '-- none --', value: null });
        return (
            <div>
                <div style={{ whiteSpace: "nowrap" }}>
                    <PropName>Widget Linking (Master-Detail):</PropName>
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Master Widget</PropName>
                    <MultiSelect
                        width={'30%'}
                        value={{label: this.resolveWidgetLabel(this.props.settings.masterWidget), value: this.props.settings.masterWidget}}
                        onChange={this.masterWidgetChanged}
                        options={widgets} />
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    <PropName>Filtered Property</PropName>
                    <MultiSelect
                        width={'30%'}
                        value={this.props.settings.dataFilter && {label: this.props.settings.dataFilter.field, value:  this.props.settings.dataFilter.field}}
                        onChange={this.masterDetailFieldChanged}
                        options={dataFields} />
                    <Spacer horizontalSpacing={0} verticalSpacing={30} />

                    <PropName>Data filter (Configuration driven)</PropName>
                    <button className="header-button"
                        onClick={this.addNewConfigFilter}
                        style={{
                            float: 'inherit',
                            marginLeft: '10px'
                        }}>
                        Add More
                    </button>
                    <Spacer horizontalSpacing={0} verticalSpacing={10} />
                    {this.buildConfigurationFilters(dataFields)}
                </div>
            </div>);
    }
}

AdvancedOptions.propTypes = {
    widgets: PropTypes.object,
    settings: PropTypes.object,
    configItems: PropTypes.array,
    onSettingsChanged: PropTypes.func,
    id: PropTypes.string
};

export default AdvancedOptions;
