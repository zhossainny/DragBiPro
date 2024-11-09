import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Modal from "../../../../common/Modal";
import ConditionalFormatPanel from "./ConditionalFormatPanel";
import {shortUid} from "../../../../../functions/utils";
import ConditionalFormatListItem from "./ConditionalFormatListItem";
import FormCaption from './../../../../common/FormCaption';
import ButtonSmallWhite from './../../../../common/ButtonSmallWhite';

class ConditionalFormatEditor extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            columnFilter: null,
            editedConditionalFormat: null,
            conditionalFormats: [],
            conditionalFormatsForCurrentColumn: [],
            selectedColumn: null,
            autoSelectColumn: true
        };

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.saveCondition = this.saveCondition.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.deleteCondition = this.deleteCondition.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.columnFilterChanged = this.columnFilterChanged.bind(this);
        this.columnSelectionChanged = this.columnSelectionChanged.bind(this);
        this.conditionalFormatChangedHandler = this.conditionalFormatChangedHandler.bind(this);
    }

    componentDidMount(){
        this.applyExistingFormats();
    }

    componentDidUpdate(){
        this.applyExistingFormats();
    }

    applyExistingFormats() {
        if (this.props.show &&
            this.props.defaultSettings.conditionalFormatting &&
            this.state.conditionalFormats.length === 0 &&
            this.props.defaultSettings.conditionalFormatting.formats.length > 0) {
            this.setState({conditionalFormats: this.props.defaultSettings.conditionalFormatting.formats});
        }
    }

    resetState(){
        this.setState({
            columnFilter: null,
            editedConditionalFormat: null,
            conditionalFormats: [],
            conditionalFormatsForCurrentColumn: [],
            selectedColumn: null,
            columnProperties: {}
        });
    }

    addNewItem(){
        if (this.state.selectedColumn) {
            let newFormat =  {
                id: shortUid(),
                name: 'Untitled',
                type: 'or',
                columnName: this.state.selectedColumn,
                entries: [{value: null, condition: null, id: shortUid()}]
            };
            this.setState({
                editedConditionalFormat: newFormat
            });
        }
        else alert('Please select a column first');
    }

    validateConditionalFormat(format) {
        let validationError = null;
        if (!format) return 'Invalid object';
        if (format.entries.length === 0 || !format.entries[0].condition && (!format.entries[0].field || !format.entries[0].value))
            return 'Must have at least one valid condition';
        if (!format.color && !format.backgroundColor)
            return 'Please specify formatting';
        return validationError;
    }

    saveCondition(){
        let conditionCopy = Object.assign({}, this.state.editedConditionalFormat);
        conditionCopy.columnName = this.state.selectedColumn;
        let validationError = this.validateConditionalFormat(conditionCopy);
        if (validationError) {
            this.setState({
                validationError: validationError
            });
            return;
        }
        let filteredConditions = this.state.conditionalFormats.filter(x => x.id !== conditionCopy.id);
        filteredConditions.push(conditionCopy);
        this.setState({
           conditionalFormats: filteredConditions,
           editedConditionalFormat: null
        });
    }

    conditionalFormatChangedHandler(conditionalFormat){
        this.setState({
            editedConditionalFormat: conditionalFormat,
            validationError: null
        });
    }

    onOk() {
        this.props.onOk({
            version: this.props.defaultSettings.conditionalFormatting ?
                this.props.defaultSettings.conditionalFormatting.version + 1 : 0,
            formats: this.state.conditionalFormats
        });
        this.resetState();
    }

    onCancel() {
        this.props.onCancel();
        this.resetState();
    }

    columnFilterChanged(e) {
        this.setState({columnFilter: e.target.value});
    }

    getColumnOptions() {
        if (!this.props.columnDefinitions) return [];
        let fields = this.props.columnDefinitions.map(col => { return col.field; });
        fields = fields.sort();
        if (this.state.columnFilter) {
            fields = fields.filter(x => {
                return x && x.toString().toLowerCase().includes(this.state.columnFilter.toString().toLowerCase());
            });
        }
        return fields.map((x, i) => {
            return <option key={i}>{x}</option>;
        });
    }

    getColumnNames() {
        if (!this.props.columnDefinitions) return [];
       return this.props.columnDefinitions.map(col => { return col.field; });
    }

    columnSelectionChanged(e) {
        let opts = [], opt;
        let len = e.target.options.length;
        for (let i = 0; i < len; i++) {
            opt =  e.target.options[i];
            if (opt.selected) {
                opts.push(opt.value);
            }
        }
        if (opts.length > 0) {
            let columnSelection = opts[0];
            let columnFormats = this.state.conditionalFormats.filter(format => format.columnName === columnSelection);
            this.setState({
                selectedColumn: columnSelection,
                conditionalFormatsForCurrentColumn: columnFormats
            });
        }
    }
    deleteCondition(id) {
        if (!id) return;
        let formats = this.state.conditionalFormats.filter(f => f.id !== id);
        this.setState({conditionalFormats: formats});
    }

    editCondition(id) {
        if (!id) return;
        let format = this.state.conditionalFormats.find(f => f.id === id);
        this.setState({editedConditionalFormat: format});
    }

    getConditionalFormats() {
        if (!this.state.selectedColumn) return [];
        let conditionalFormats = this.state.conditionalFormats.filter(f => f.columnName === this.state.selectedColumn);
        return conditionalFormats.map((format, i) => {
            return (
               <ConditionalFormatListItem counter={i}
                                          key={format.id}
                                          deleteCondition={this.deleteCondition}
                                          editCondition={this.editCondition}
                                          format={format} />
            );
        });
    }

    render() {
        let columnOptions = this.getColumnOptions();
        let columnNames = this.getColumnNames();
        let formats = this.getConditionalFormats();
        return (
            <Modal show={this.props.show}
                   onOK={this.onOk}
                   onCancel={this.onCancel}
                   width={'640px'}>
                <FormCaption>Conditional Formatting</FormCaption>
                {this.state.selectedColumn && !this.state.editedConditionalFormat && <ButtonSmallWhite minWidth={'60px'} onClick={this.addNewItem}>Create New</ButtonSmallWhite>}
                <div className="container" style={{width: '100%'}}>
                    <div className="row">
                        <div className="col-md-5" style={{paddingLeft: 0}}>
                            <FilterInput placeholder="Filter.."
                                         onChange={this.columnFilterChanged}
                                         name={'filter'}/>
                            <ColumnSelector multiple className="form-control" onChange={this.columnSelectionChanged}>
                                {columnOptions}
                            </ColumnSelector>
                        </div>
                        {formats.length === 0 && this.state.selectedColumn && !this.state.editedConditionalFormat &&
                        <div className="col-md-7" >
                            <Placeholder>No rules defined. Use the button above to add new rules.</Placeholder>
                        </div>}
                        {!this.state.selectedColumn &&
                        <div className="col-md-7" >
                            <Placeholder>Please select a column from the list on the right.</Placeholder>
                        </div>}
                        {formats.length > 0 && !this.state.editedConditionalFormat &&
                            <div className="col-md-7">
                                <div style={{ margin: '20px 10px 10px 30px'}}>
                                    <SubCaption>{'Conditional formats for \''+ this.state.selectedColumn +'\''}</SubCaption>
                                    {formats}
                                </div>
                            </div>
                        }
                        {this.state.editedConditionalFormat &&
                        <div className="col-md-7">
                            <ConditionalFormatPanel columnNames={columnNames}
                                                    selectedColumn={this.state.selectedColumn}
                                                    conditionalFormat={this.state.editedConditionalFormat}
                                                    onConditionalFormatChanged={this.conditionalFormatChangedHandler}
                            />
                            {this.state.selectedColumn && this.state.editedConditionalFormat && <ButtonBlue onClick={this.saveCondition}>Add</ButtonBlue>}
                            {this.state.validationError && <ErrorText>{this.state.validationError}</ErrorText>}
                        </div>
                        }
                    </div>
                </div>
            </Modal>
        );
    }
}

ConditionalFormatEditor.propTypes = {
    show: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    columnDefinitions: PropTypes.array,
    defaultSettings: PropTypes.object
};

const ColumnSelector = styled.select`
    max-width: 300px;
    min-height: 350px;
    margin: 5px 10px 5px 10px;
`;

const ErrorText = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: red;
    padding-top: 20px;
`;

const SubCaption = styled.label`
    color: #d1551d;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 20px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
`;


const ButtonBlue = styled.button`
    background-color: #337ab7;
    border: none;
    border-radius: 3px;
    color: white;
    margin: 0px 0px 15px 10px;
    padding: 5px 8px;
    text-decoration: none;
    display: inline-block;
    float: right;
    width: 60px;
    opacity: ${props=> props.disabled ? '0.7' : '1'}
    &:hover  {
        background-color: ${props=> props.disabled ? '#337ab7' : '#2d6fa8'};
        cursor: ${props=> props.disabled ? 'hand' : 'pointer'};
    }
`;

const Placeholder = styled.label`
    margin-top: 55%;
    margin-left: 40px;
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


export default ConditionalFormatEditor;

