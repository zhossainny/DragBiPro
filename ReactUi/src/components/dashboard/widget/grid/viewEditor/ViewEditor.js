import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Modal from "../../../../common/Modal";
import { AG_GRID_DEFAULT_DATE_FORMAT, AG_GRID_AUTO_COLUMN } from "../../../../../configuration/constants";
import FormCaption from './../../../../common/FormCaption';
import ColumnProperties from './ColumnProperties';
import ButtonSmallWhite from './../../../../common/ButtonSmallWhite';

class ViewEditor extends React.Component {

    static createBlankColumnFormat(name) {
        return {
            field: name,
            caption: name,
            fontSize: null,
            fontStyle: 'normal',
            dateFormat: AG_GRID_DEFAULT_DATE_FORMAT,
            decimalPrecision: 2,
            formatDollar: false,
            type: 'text'
        };
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            columnFilter: null,
            selectedColumns: [],
            columnProperties: {},
            activeFormat: null,
            autoSelectColumn: true,
            viewReset: false
        };

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.resetView = this.resetView.bind(this);
        this.columnFilterChanged = this.columnFilterChanged.bind(this);
        this.columnSelectionChanged = this.columnSelectionChanged.bind(this);
        this.columnPropertiesChangedHandler = this.columnPropertiesChangedHandler.bind(this);
    }

    componentDidMount() {
        this.applyExistingView();
        this.selectFirstColumnOption();
    }

    componentDidUpdate() {
        this.applyExistingView();
        this.selectFirstColumnOption();
    }

    selectFirstColumnOption() {
        if (!this.state.autoSelectColumn || !this.props.show) return;
        if (this.props.selectedColumn && this.state.selectedColumns.indexOf(this.props.selectedColumn.field) === -1 &&
            this.state.selectedColumns.indexOf('Group')) {
            let field = this.props.selectedColumn.field;
            if (this.props.selectedColumn.colId === AG_GRID_AUTO_COLUMN)
                field = 'Group';
            this.setState({ selectedColumns: [field] });
            this.setActiveProperties([field]);
        } else if (this.state.selectedColumns.length === 0 && this.props.columnDefinitions) {
            let firstHeader = this.props.columnDefinitions[0].field;
            this.setState({ selectedColumns: [firstHeader] });
            this.setActiveProperties([firstHeader]);
        }
    }

    applyExistingView() {
        if (!this.state.viewReset &&
            this.props.defaultSettings.view &&
            this.props.defaultSettings.view.columnProperties &&
            Object.keys(this.props.defaultSettings.view.columnProperties).length > 0 &&
            Object.keys(this.state.columnProperties).length === 0) {
            this.setState({ columnProperties: this.props.defaultSettings.view.columnProperties });
        }
    }

    onOk() {
        if (this.state.activeFormat && this.state.activeFormat.dirty) {
            this.saveColumnProperties(this.state.selectedColumns);
        }
        let version = this.props.defaultSettings.view ? this.props.defaultSettings.view.version + 1 : 0;
        this.props.onOk({
            columnProperties: this.state.columnProperties,
            version: version
        });
        this.resetState();
    }

    onCancel() {
        this.resetState();
        this.props.onCancel();
    }

    resetState() {
        this.setState({
            selectedColumns: [],
            columnProperties: {},
            columnFilter: null,
            activeFormat: null,
            autoSelectColumn: true,
            viewReset: false
        });
    }

    createDefaultColumnFormat(columnDefinition) {
        if (!columnDefinition) return null;
        let columnType = null;
        if (columnDefinition.type)
            columnType = columnDefinition.type === 'numericColumn' ? 'numeric' : 'text';
        return {
            field: columnDefinition.field,
            caption: columnDefinition.headerName,
            fontSize: null,
            fontStyle: 'normal',
            dateFormat: AG_GRID_DEFAULT_DATE_FORMAT,
            decimalPrecision: this.props.defaultSettings.decimalPrecision,
            formatDollar: this.props.defaultSettings.formatDollar && columnDefinition.field.includes('$'),
            type: columnType
        };
    }

    columnSelectionChanged(e) {
        this.setState({ autoSelectColumn: false });
        let opts = [], opt;
        let len = e.target.options.length;
        for (let i = 0; i < len; i++) {
            opt = e.target.options[i];
            if (opt.selected) {
                opts.push(opt.value);
            }
        }
        if (this.state.activeFormat && this.state.activeFormat.dirty) {
            this.saveColumnProperties(opts);
        } else {
            this.setState({ selectedColumns: opts });
        }
        this.setActiveProperties(opts);
    }

    saveColumnProperties(opts) {
        let columnProperties = this.state.columnProperties;
        if (this.state.selectedColumns.length > 1) {
            this.state.selectedColumns.forEach(selection => {
                let colDef = this.props.columnDefinitions.find(x => x.field === selection);
                let existingFormat = columnProperties[selection] || this.createDefaultColumnFormat(colDef);
                let caption = existingFormat.caption;
                let newFormat = Object.assign(existingFormat, this.state.activeFormat);
                newFormat.caption = caption;
                newFormat.field = selection;
                columnProperties[selection] = newFormat;
            });
        } else {
            columnProperties[this.state.activeFormat.field] = this.state.activeFormat;
        }
        this.setState({
            selectedColumns: opts,
            columnProperties: columnProperties
        });
    }

    resetView() {
        this.setState({
            selectedColumns: [],
            columnProperties: {},
            viewReset: true
        });
    }

    setActiveProperties(selectedColumns) {
        let selection = selectedColumns[0];
        let colDef = this.props.columnDefinitions.find(x => x.field === selectedColumns[0]);
        let activeFormat = this.state.columnProperties[selection];
        if (!activeFormat) {
            activeFormat = selection === 'Group' ? ViewEditor.createBlankColumnFormat('Group') : this.createDefaultColumnFormat(colDef);
        }
        this.setState({ activeFormat: activeFormat });
    }

    getColumnOptions() {
        if (!this.props.columnDefinitions) return [];
        let fields = this.props.columnDefinitions.map(col => { return col.field; });
        fields = fields.sort();
        fields = ['Group'].concat(fields);
        if (this.state.columnFilter) {
            fields = fields.filter(x => {
                return x && x.toString().toLowerCase().includes(this.state.columnFilter.toString().toLowerCase());
            });
        }
        return fields.map((x, i) => {
            return <option key={i} selected={this.state.selectedColumns.indexOf(x) > -1}>{x}</option>;
        });
    }

    columnPropertiesChangedHandler(props) {
        this.setState({ activeFormat: props });
    }

    columnFilterChanged(e) {
        this.setState({ columnFilter: e.target.value });
    }

    render() {
        let columnOptions = this.getColumnOptions();
        return (
            <Modal show={this.props.show}
                onOK={this.onOk}
                onCancel={this.onCancel}
                width={'640px'}>
                <FormCaption>View Editor</FormCaption>
                <ButtonSmallWhite onClick={this.resetView}>Reset</ButtonSmallWhite>
                <div className="container" style={{ width: '100%' }}>
                    <div className="row">
                        <div className="col-md-5" style={{ paddingLeft: 0 }}>
                            <FilterInput placeholder="Filter.."
                                onChange={this.columnFilterChanged}
                                name={'filter'} />
                            <ColumnSelector multiple className="form-control" onChange={this.columnSelectionChanged}>
                                {columnOptions}
                            </ColumnSelector>
                        </div>
                        {!this.state.activeFormat &&
                            <div className="col-md-7" >
                                <Placeholder>Please select a column to edit</Placeholder>
                            </div>}
                        {this.state.activeFormat &&
                            <div className="col-md-7">
                                <ColumnProperties columnProperties={this.state.activeFormat}
                                    selectedColumns={this.state.selectedColumns}
                                    onPropertiesChanged={this.columnPropertiesChangedHandler} />
                            </div>
                        }
                    </div>
                </div>
            </Modal>
        );
    }
}

ViewEditor.propTypes = {
    show: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    columnDefinitions: PropTypes.array,
    selectedColumn: PropTypes.object,
    defaultSettings: PropTypes.object
};

const Placeholder = styled.label`
    margin-top: 50%;
    margin-left: 60px;
    min-width: 100px;
    font-size:12px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
`;

const FilterInput = styled.input`
    padding: 3px;
    min-width: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin: 20px 10px 5px 10px;
    width: 100%;
`;

const ColumnSelector = styled.select`
    max-width: 300px;
    min-height: 250px;
    margin: 5px 10px 5px 10px;
`;

export default ViewEditor;

