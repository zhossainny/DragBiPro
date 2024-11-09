/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../../../../css/widget.css';
import styled, { css } from "styled-components";
import Spacer from "../../../common/Spacer";
import GridOptions from "./GridOptions";
import * as constants from '../../../../configuration/constants';
import AdvancedOptions from "./../AdvancedOptions";
import { findConfigItemsInExpression } from './../../../../functions/utils';
import { getSortedCopy } from './../../../../functions/dashboard/agGridUtils';


class GridWidgetEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            advancedOptionsVisible: false
        };

        this.urlChanged = this.urlChanged.bind(this);
        this.parseLocalFile = this.parseLocalFile.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.onLoadClickHandler = this.onLoadClickHandler.bind(this);
        this.controlChanged = this.controlChanged.bind(this);
        this.jsonPathChanged = this.jsonPathChanged.bind(this);
        this.toggleAdvancedOptions = this.toggleAdvancedOptions.bind(this);
        this.gridSettingsChanged = this.gridSettingsChanged.bind(this);
    }

    titleChanged(e) {
        const value = e.target.value;
        this.props.onSettingsChanged({ ...this.props.settings, title: value });
    }

    controlChanged(e) {
        const value = e.target.value;
        this.props.onSettingsChanged({ ...this.props.settings, controlType: value });
    }

    jsonPathChanged(e) {
        const value = e.target.value;
        this.props.onSettingsChanged({ ...this.props.settings, jsonPropertyPath: value });
    }

    gridSettingsChanged(settings) {
        this.props.onSettingsChanged({ ...this.props.settings, grid: settings });
    }

    toggleAdvancedOptions() {
        this.setState({ advancedOptionsVisible: !this.state.advancedOptionsVisible });
    }

    urlChanged(e) {
        const value = e.target.value;
        this.props.onSettingsChanged({ ...this.props.settings, url: value });
        this.parseUrlArgs(value);
    }

    parseUrlArgs(url) {
        const urlSegments = url.split("?");
        let queryStringParams = new URLSearchParams(urlSegments[1]);
        let args = [];
        const matchingConfigItemsInQueryString = findConfigItemsInExpression(urlSegments[1], this.props.configItems);
        Array.from(queryStringParams.entries()).forEach(searchParamPair => {
            let matchingConfigItem = matchingConfigItemsInQueryString.find(configPair => searchParamPair[1] === `{${configPair.key}}`);
            if (matchingConfigItem) {
                args.push({ key: searchParamPair[0], value: matchingConfigItem.value });
            } else {
                args.push({ key: searchParamPair[0], value: searchParamPair[1] });
            }
        });
        this.props.onSettingsChanged({ ...this.props.settings, urlArgs: args, url: url });
    }

    onLoadClickHandler() {
        this.props.onLoadButtonClick();
    }

    getUrlArgs() {
        let args = this.props.settings.urlArgs;
        if (args.length > 0) {
            return args.map(arg => {
                return (
                    <div style={{ whiteSpace: "nowrap" }} key={arg.key}>
                        <Spacer horizontalSpacing={0} verticalSpacing={10} />
                        <UrlArgName>{arg.key}</UrlArgName>
                        <UrlArgValue placeholder="value"
                                     name="argVal"
                                     value={arg.value} />
                    </div>);
            });
        }
        return null;
    }

    parseLocalFile(files) {
        let reader = new FileReader();
        reader.onload = () => {
            this.props.onFileUpload(reader.result);
        };
        reader.readAsBinaryString(files[0]);
    }

    getGridOptions() {
        if (this.props.settings.controlType !== "grid") {
            return null;
        }

        return (<GridOptions
            settings={this.props.settings.grid}
            columnNames={this.props.settings.columnNames}
            onSettingsChanged={this.gridSettingsChanged}
        />);
    }

    hasAdvancedOptions = () => {
        return this.state.advancedOptionsVisible ;
    }

    getAdvancedOptions() {
        return (<AdvancedOptions
            id={this.props.id}
            settings={this.props.settings}
            widgets={this.props.widgets}
            onSettingsChanged={this.props.onSettingsChanged}
            configItems={this.props.configItems}
        />);
    }

    render() {
        this.props.settings.controlType = 'grid';
        let showJsonProps = this.props.dataType === constants.DATA_TYPE_JSON &&
            this.props.settings.controlType !== 'metric' && this.props.settings.controlType !== 'percentage_pie';
        let parameterizedUrl = this.props.settings.url && this.props.settings.url.includes('?');
        return (
            <Container>
                <Spacer horizontalSpacing={0} verticalSpacing={20} />
                <div className="container" style={{ marginLeft: "0px", width: "100%", background:"#262626", color:"white" }}>
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    <HeaderMedium>Grid Settings</HeaderMedium>
                    <div className="row" >
                        <div className="col-sm-1">
                            <HeaderSmall>Title</HeaderSmall>
                        </div>
                        <div className="col-sm-11">
                            <InputText placeholder="Report name (mandatory)"
                                       name="title"
                                       value={this.props.settings.title}
                                       onChange={this.titleChanged} />
                        </div>
                    </div>
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    <div className="row">
                        <div className="col-sm-1">
                            <HeaderSmall>Source</HeaderSmall>
                        </div>
                        <div className={parameterizedUrl ? "col-sm-9" : "col-sm-11"}>
                            <InputText placeholder="Json URL (We dont save your data)"
                                       name="urlInput"
                                       value={this.props.settings.url}
                                       onChange={this.urlChanged} />
                            {this.props.dataError && <ErrorMessage>{this.props.dataError}</ErrorMessage>}
                            {this.getUrlArgs()}
                        </div>
                        {parameterizedUrl &&
                        <div className="col-sm-2">
                            <ButtonLoadUrl onClick={this.props.onLoadUrl}>
                                Load
                            </ButtonLoadUrl>
                        </div>
                        }
                    </div>
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    {showJsonProps &&
                    <div className="row">
                        <div className="col-sm-1">
                            <HeaderSmall>Path</HeaderSmall>
                        </div>
                        <div className="col-sm-11">
                            <DropDown onChange={this.jsonPathChanged}
                                      value={this.props.settings.jsonPropertyPath}>
                                <option key="0" value="">-- Select JSON Path --</option>
                                {getSortedCopy(this.props.settings.jsonProperties).map(path => (<option key={path} value={path}>{path}</option>))}
                            </DropDown>
                        </div>
                    </div>
                    }
                    {showJsonProps &&
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    }
                    {!this.props.settings.url &&
                    <div className="row">
                        <div className="col-sm-1" />
                        <div className="col-sm-11">
                            <input type={"file"} name="file" id="file" className="inputfile"
                                   accept=".csv,.json"
                                   onChange={(e) => this.parseLocalFile(e.target.files)} />
                            <label htmlFor="file">
                                <i className="fa fa-cloud-upload" style={{ marginRight: "5px" }} />
                                Upload File
                            </label>
                        </div>
                    </div>
                    }
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    {(this.props.remoteData || this.props.uploadData || this.props.dataError) &&
                    <div className="row">
                        <div className="col-sm-1">
                            <HeaderSmall>Control</HeaderSmall>
                        </div>
                        <div className="col-sm-11">

                            {this.props.dataError &&
                            <DropDown onChange={this.controlChanged}
                                      value={this.props.settings.controlType}>
                                <option value="">select iFrame option</option>
                                <option value="external">External</option>
                            </DropDown>
                            }
                            {this.getGridOptions()}

                        </div>
                    </div>}
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    {this.props.settings.controlType && <div className="row">
                        <div className="col-sm-1">
                            <AdvancedSettingsButton onClick={this.toggleAdvancedOptions}>Advanced
                                <i className={this.state.advancedOptionsVisible ? "fa fa-angle-up" : "fa fa-angle-down"} />
                            </AdvancedSettingsButton>
                        </div>
                    </div>}
                    {this.hasAdvancedOptions() &&
                    <div className="row">
                        <div className="col-sm-1" />
                        <div className="col-sm-11">
                            {this.getAdvancedOptions()}
                        </div>
                    </div>}
                    <div className="row">
                        <Spacer horizontalSpacing={1} verticalSpacing={10} />
                    </div>
                    <div className="row">
                        <div className="col-sm-1" />
                        <div className="col-sm-11">
                            <ButtonSmallBlue onClick={this.onLoadClickHandler}
                                             disabled={!this.props.remoteData &&
                                             this.props.settings.controlType !== 'external' &&
                                             !this.props.uploadData || !this.props.settings.controlType || !this.props.settings.title}>
                                Create
                            </ButtonSmallBlue>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

GridWidgetEdit.propTypes = {
    onLoadButtonClick: PropTypes.func,
    onSettingsChanged: PropTypes.func,
    onFileUpload: PropTypes.func,
    onLoadUrl: PropTypes.func,
    settings: PropTypes.object,
    remoteData: PropTypes.object,
    uploadData: PropTypes.object,
    dataError: PropTypes.string,
    dataType: PropTypes.string,
    widgets: PropTypes.object,
    configItems: PropTypes.array,
    id: PropTypes.string
};

const ButtonSmallBlue = styled.button`
    width: 70px;  
    float: right;
    background-color: ${props => props.disabled ? '#e0e0e0' : '#730073'}; 
    border: none;
    border-radius: 3px;
    min-width: 50px;
    color: white;
    margin: 15px 0px 20px 0px;
    padding: 2px 8px;
    text-decoration: none;
    display: block;
    opacity: ${props => props.disabled ? '0.8' : '1'};
    &:hover  {
        cursor: ${props => props.disabled ? 'hand' : 'pointer'};
    }
`;

const ButtonLoadUrl = styled.button`
    width: 60px;  
    background-color: ${props => props.disabled ? '#e0e0e0' : '#730073'};
    border: none;
    border-radius: 3px;
    min-width: 50px;
    color: white;
    margin-top: 1px;
    padding: 2px 8px;
    text-decoration: none;
    display: block;
    opacity: ${props => props.disabled ? '0.8' : '1'};
    &:hover  {
        cursor: ${props => props.disabled ? 'hand' : 'pointer'};
    }
`;

const sharedStyles = css`
    font-size: 12px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    background:#262626;
    color:white;

`;

const DropDown = styled.select`
    ${sharedStyles}
    padding: 3px;
    width: 100%;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
`;

const Container = styled.div`
    padding: 1px 15px;
    height: 100%;
    width: 100%;
    background-color: black;
    overflow: auto;
`;

const HeaderSmall = styled.label`
    ${sharedStyles}
    margin-top: 5px;
    font-weight: 500;
    color:white;
`;

const HeaderMedium = styled.label`
    font-size: 12px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    background:#262626;
    margin-top: 5px;
    font-weight: 500;
    color:orange;
`;

const AdvancedSettingsButton = styled.span`
    ${sharedStyles}
    display: inline-flex;
    align-items: center;
    margin-top: 5px;
    font-weight: 500;
    cursor: pointer;
     i {
         margin-left: 4px;
     }
`;

const UrlArgName = styled.label`
    ${sharedStyles}
    margin-top: 5px;
    min-width: 100px;
    font-weight: 400;
`;

const UrlArgValue = styled.input`
    ${sharedStyles}
    padding: 3px;
    width: 10%;
    min-width: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
`;


const InputText = styled.input`
    ${sharedStyles}
    padding: 3px;
    width: 100%;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    background:#262626;
    color:white;
`;

const ErrorMessage = styled.p`
    color: red;
    padding-top: 5px;
    font-size:0.9em;
`;

export default GridWidgetEdit;