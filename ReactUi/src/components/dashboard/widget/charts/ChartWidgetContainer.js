/* eslint-disable react/no-direct-mutation-state,react/no-did-mount-set-state,react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import toastr from 'toastr';
import { connect } from 'react-redux';
import '../../../../css/widget.css';
import styled from "styled-components";
import { bindActionCreators } from "redux";
import * as widgetActions from '../../../../actions/dashboardWidgetActions';
import * as dashActions from '../../../../actions/dashboardActions';
import * as constants from '../../../../configuration/constants';
import * as dataUtils from "../../../../functions/dataUtils";
import WidgetEditor from "./ChartWidgetEdit";
import { ScaleLoader } from 'react-spinners';
import * as utils from '../../../../functions/utils';
import { getQdStoreUri } from '../../../../configuration/config';
import ErrorSnapshot from "../../../../models/dashboard/ErrorSnapshot";
import BrokenDataIcon from '../../../../images/broken-widget.png';
import WidgetJsonDataManager from "../../../../functions/dashboard/WidgetJsonDataManager";
import WidgetCsvDataManager from "../../../../functions/dashboard/WidgetCsvDataManager";
import IFrameWidget from "./../iframe/IFrameWidget";
import * as widgetUtils from "../../../../functions/dashboard/WidgetContainerUtils";
import WidgetFilterManager from "../../../../functions/dashboard/WidgetFilterManager";
import * as mathjs from 'mathjs';
import HighChartWidget from "./HighChartWidget";


class ChartWidgetContainer extends React.Component {

    constructor(props) {
        super(props);

        if (this.props.glContainer.parent.config.state) {
            this.state = widgetUtils.resetSavedState(this.props.glContainer.parent.config.state);
        } else {
            this.state = widgetUtils.getDefaultState(this.props.glContainer.parent.config.id);
        }
        this.loadButtonHandler = this.loadButtonHandler.bind(this);
        this.settingsChanged = this.settingsChanged.bind(this);
        this.localFileUploadHandler = this.localFileUploadHandler.bind(this);
        this.generateImage = this.generateImage.bind(this);
        this.editWidget = this.editWidget.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.widgetErrorHandler = this.widgetErrorHandler.bind(this);

    }

    componentDidMount() {
        if (this.state.restoredState) {
            this.refreshData(false);
            this.props.actions.editWidget(this.state.uid, false);
            this.props.actions.registerWidget(this.state.uid, this.state.settings.title);
            this.props.actions.setMasterWidget(this.state.settings.masterWidget);
        }
        this.setState({
            uid: this.props.glContainer.parent.config.id,
            forceRefreshCount: 0
        });

        if (this.state.showHeaders !== null && typeof (this.props.showHeaders) !== 'boolean') {
            this.props.actions.toggleHeaders(this.state.showHeaders);
        }
        toastr.options.preventDuplicates = true;
    }

    componentDidUpdate(prevProps, prevState) {
        this.injectWidgetControlButtons();
        this.saveState();

        let dataFilters = new WidgetFilterManager(this.props.widgets, this.props.configItems).getDataFilters(this.state.settings.masterWidget,
            this.state.settings.dataFilter,
            this.state.settings.configurationFilters,
            this.appliedDataFilters);
        let dataLoading = this.isDataLoading();

        if (dataLoading && !this.state.dataLoading)
            this.setState({ dataLoading: dataLoading });

        if (this.state.showHeaders !== this.props.showHeaders && this.props.showHeaders !== null) {
            this.setState({ showHeaders: this.props.showHeaders });
        }

        if (this.canHandleUpdateFromCache(dataFilters)) {
            return;
        }

        if (this.jsonPropertyPathChanged(prevState)) {
            this.processData(this.state.dataSnapshot, dataFilters);
            return;
        }

        if (prevState.settings.controlType !== this.state.settings.controlType) {
            this.processData(this.state.dataSnapshot, dataFilters);
            return;
        }

        if (dataFilters) {
            this.processData(this.state.dataSnapshot, dataFilters);
        }
    }

    componentWillUnmount() {
        this.props.actions.deregisterWidget(this.state.uid);
    }

    isDataLoading() {
        let url = this.state.settings.url;
        if (!url) return false;
        return (url && this.props.refreshingUrls.includes(url));
    }

    loadButtonHandler() {
        //data should be already loaded at this point
        this.processData(this.state.dataSnapshot);
        this.props.actions.editWidget(this.state.uid, false);
    }

    resetLocalCachedData() {
        this.setState({
            dataLoading: false,
            gridDataSource: {
                columnDefs: [],
                rows: [],
                version: this.state.gridDataSource.version + 1
            }
        });
    }

    generateImage() {
        utils.htmlToJPG(this.props.glContainer.parent.config.id, this.state.settings.title);
    }

    canHandleUpdateFromCache(dataFilters) {
        let url = this.state.settings.url;

        if (url in this.props.dataCache) {
            let dataSnapshot = this.props.dataCache[url].snapshot;
            if (!dataSnapshot) return;
            if (dataSnapshot instanceof ErrorSnapshot && !this.state.dataFetchError) {
                this.setState({
                    dataFetchError: dataSnapshot.getError(),
                    dataLoading: false
                });
                return true;
            }

            if (!this.state.dataSnapshot ||
                dataSnapshot.getVersion() !== this.state.dataSnapshot.getVersion() ||
                dataSnapshot.getUrl() !== this.state.dataSnapshot.getUrl()) {

                this.processData(dataSnapshot, dataFilters);
                return true;
            }
        }

        return false;
    }

    jsonPropertyPathChanged(prevState) {
        return prevState.settings.jsonPropertyPath !== this.state.settings.jsonPropertyPath &&
            this.state.settings.jsonPropertyPath &&
            this.state.dataType === constants.DATA_TYPE_JSON;
    }

    getStateUpdate(dataType, dataSnapshot, dataToProcess, dataFilters) {
        let stateUpdate = {
            dataType: dataType,
            dataLoading: false,
            dataFetchError: null,
            dataSnapshot: dataSnapshot
        };
        let dsManager = null;
        let settingsCopy = { ...this.state.settings };
        if (dataType === constants.DATA_TYPE_JSON) {
            dsManager = new WidgetJsonDataManager(dataToProcess,
                this.state.settings.jsonPropertyPath,
                dataFilters);
            settingsCopy.columnNames = dsManager.getColumnNames();
            settingsCopy.jsonProperties = dsManager.getJsonProperties();
        } else if (dataType === constants.DATA_TYPE_CSV) {
            dsManager = new WidgetCsvDataManager(dataToProcess, dataFilters);
            settingsCopy.columnNames = dsManager.getColumnNames();
        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Invalid data type: ' + dataType);
        }

        stateUpdate.settings = settingsCopy;

        return { stateUpdate, dsManager };
    }

    processData(dataSnapshot, dataFilters = null) {
        try {
            let dataToProcess = this.state.fileUploadData || !dataSnapshot ?
                this.state.fileUploadData : dataSnapshot.getPayload();  //local upload has precedence over remote data
            if (!dataToProcess) return;

            this.resetLocalCachedData();
            const dataType = dataUtils.getDataType(dataToProcess);
            const { stateUpdate, dsManager } = this.getStateUpdate(dataType, dataSnapshot, dataToProcess, dataFilters);

            switch (this.state.settings.controlType) {
                case 'grid':
                    if (dataType === constants.DATA_TYPE_CSV ||
                        (dataType === constants.DATA_TYPE_JSON && this.state.settings.jsonPropertyPath))
                        stateUpdate.gridDataSource = dsManager.getAgGridDataSource(this.state.settings.grid, this.state.gridDataSource.version);
                    break;
                case 'chart':
                    if (dataType === constants.DATA_TYPE_CSV ||
                        (dataType === constants.DATA_TYPE_JSON && this.state.settings.jsonPropertyPath))
                        stateUpdate.chartDataSource = dsManager.getHighChartsDataSource(this.state.chartDataSource.version);
                    break;
                case 'metric': {
                    if (dataType === constants.DATA_TYPE_JSON)
                        stateUpdate.metricDataSource = dsManager.getMetricDataSource(this.state.settings.metric, this.state.metricDataSource.version);
                    break;
                }
                case 'percentage_pie': {
                    if (dataType === constants.DATA_TYPE_JSON)
                        stateUpdate.metricDataSource = dsManager.getPercentagePieDataSource(this.state.settings.percentage, this.state.metricDataSource.version);
                    break;
                }
                default: break;
            }

            this.appliedDataFilters = dataFilters ? dataFilters : [];
            this.setState(stateUpdate);
        } catch (e) {
            console.error('Failed to process data. ' + e.message);
            this.appliedDataFilters = dataFilters ? dataFilters : [];
            this.setState({
                dataLoading: false,
                dataSnapshot: dataSnapshot, //let's remember the offending snapshot
                dataFetchError: 'Failed to process data. ' + utils.shortMessage(e.message)
            });
        }
    }

    widgetErrorHandler(message) {
        this.setState({
            dataLoading: false,
            dataFetchError: 'Failed to process data. ' + utils.shortMessage(message)
        });
    }

    localFileUploadHandler(fileContent) {
        if (!fileContent) return;
        let fileId = this.state.localFileId ? this.state.localFileId : utils.shortUid();
        let settingsCopy = Object.assign({}, this.state.settings);
        settingsCopy.url = '';
        this.setState({
            fileUploadData: fileContent,
            localFileId: fileId,
            dataFetchError: null,
            settings: settingsCopy

        });
        this.processData(null);
        this.props.actions.localDataLoaded(this.state.uid, true);
        this.props.actions.saveLocalFile(this.props.userId,
            this.getCollectionMeta(), fileId + constants.LOCAL_FILE_PREFIX,
            { data: btoa(fileContent) });
    }

    getCollectionMeta() {
        return {
            key: this.props.userId,
            name: 'Personal Collection for ' + this.props.userId,
            description: "Temp files",
            isRetired: false
        };
    }

    refreshData(forceRefresh = true) {
        if (forceRefresh && this.state.settings.controlType === 'external') {
            this.setState(state => ({ forceRefreshCount: state.forceRefreshCount + 1 }));
            return;
        }

        if (forceRefresh) {
            this.loadData(this.state.settings.url, true);
            return;
        }

        if (!this.state.fileUploadData) {
            this.loadData(this.state.settings.url, false);
        }
    }

    loadData(url, forceRefresh) {
        this.setState({
            uid: this.props.glContainer.parent.config.id,
            dataLoading: true,
            dataFetchError: null,
            fileUploadData: null
        });
        this.props.actions.loadData(url, forceRefresh);
        this.props.actions.localDataLoaded(this.state.uid, false);
        this.props.actions.registerUrl(this.state.uid, url);
    }

    editWidget() {
        let widgetState = this.props.widgets[this.state.uid];
        let editing = widgetState ? !widgetState.editing : true;
        this.props.actions.editWidget(this.state.uid, editing);
    }

    settingsChanged(newSettings) {
        if (newSettings.title) {
            this.props.glContainer.parent.setTitle(newSettings.title);
            this.props.actions.registerWidget(this.state.uid, newSettings.title);
        }
        if (newSettings.url)
            newSettings.url = newSettings.url.toString().trim();
        let newUrl = newSettings.url;
        if (newUrl && this.currentUrl !== newUrl) {
            this.urlChanged(newUrl);
            this.currentUrl = newUrl;
        }
        if (this.state.settings.masterWidget !== newSettings.masterWidget) {
            this.props.actions.setMasterWidget(newSettings.masterWidget);
        }
        this.setState({ settings: newSettings });
    }

    urlChanged(url) {
        if (!url) return;
        if (url.includes('?')) return; //don't auto load parametrized urls

        //if no data loaded - load
        if (!this.state.dataSnapshot) {
            this.loadData(url, false);
            return;
        }
        //if same url - don't load
        let baseUrl = url.toString().split("?");
        if (this.state.settings.url.toString().startsWith(baseUrl)) return;
        this.loadData(url, false);
    }

    injectWidgetControlButtons() {
        if (this.props.glContainer.tab && this.props.glContainer.tab.isActive) {
            let editing = this.isEditing();
            let timestamp = null;
            if (this.state.fileUploadData) {
                timestamp = 'local';
            } else if (this.state.dataSnapshot) {
                timestamp = this.state.dataSnapshot.getFormattedTimeStamp();
            }
            let dataLoading = this.isDataLoading();
            let showTimestamp = this.state.settings.controlType !== 'metric' && this.state.settings.controlType !== 'percentage_pie';
            let id = this.props.glContainer.parent.config.id;
            let filterTextBoxClass = this.state.settings.grid.filterText ? 'dirtyFilterBox' : '';
            let controls =
                (<span id={'widgetToolbox'}>
                    {dataLoading && <LoadingIndicatorContainer>
                        <ScaleLoader loading color={"#F39318"} height={10} width={4} />
                    </LoadingIndicatorContainer>}
                    {!editing &&
                    <span>
                            {timestamp && showTimestamp &&
                            <label className="header-label"><i className="fa fa-clock-o" aria-hidden="true" /> {timestamp}</label>}

                        {!this.state.fileUploadData && <button className="header-button" onClick={this.refreshData}>
                            <i className="fa fa-refresh" />&nbsp; Refresh
                        </button>}
                        <button className={'header-button'} onClick={this.generateImage}>JPG</button>
                        </span>
                    }
                    <button className="header-button" onClick={this.editWidget}>Settings</button>
                </span>);
            ReactDOM.render(controls, this.props.glContainer.tab.header.controlsContainer[0].firstChild);
            this.props.actions.registerControls(id, controls);
            this.props.glContainer.tab.header.position(this.state.showHeaders);
        }
    }

    isEditing() {
        if (this.state.uid) {
            let widgetState = this.props.widgets[this.state.uid];
            if (!widgetState || typeof widgetState.editing === 'undefined') return true;
            return widgetState.editing;
        }
        return true;
    }

    saveState(gridVisualState) {
        let stateCopy = $.extend(true, {}, this.state);
        stateCopy.gridDataSource = {
            columnDefs: null,
            rows: null,
            version: 0
        };
        if (gridVisualState) {
            stateCopy.settings.grid.gridVisualState = gridVisualState;
        }
        stateCopy.chartDataSource.data = null;
        stateCopy.settings.grid.filterText = null;
        if (stateCopy.fileUploadData) {
            stateCopy.settings.url = getQdStoreUri() + '/data/'
                + this.props.userId + '/DEV/' + stateCopy.localFileId + constants.LOCAL_FILE_PREFIX;
        }
        stateCopy.fileUploadData = null;
        stateCopy.dataSnapshot = null;
        this.props.glContainer.parent.config.state = stateCopy;
    }

    render() {
        let editing = this.isEditing();
        let externalData = this.state.settings.controlType === 'external';
        let showError = this.state.dataFetchError && !editing && !externalData;
        this.state.settings.controlType='chart';
        return (
            <Container className={'widgetContainer'} id={this.props.glContainer.parent.config.id}>
                {this.state.dataFetchError && !externalData && <ErrorBar />}
                {showError &&
                <ErrorContainer>
                    <ImageIcon src={BrokenDataIcon} />
                    <ErrorText>{this.state.dataFetchError}</ErrorText>
                </ErrorContainer>
                }
                {!editing && !showError && <HighChartWidget
                    id={this.state.uid}
                    title={this.state.settings.title}
                    container={this.props.glContainer}
                    dataSource={this.state.chartDataSource}
                    dataFilter={this.state.settings.dataFilter}
                    configItems={this.props.configItems}
                    settings={this.state.settings.chart}
                    onError={this.widgetErrorHandler}
                />}
                {editing &&
                <WidgetEditor
                    id={this.state.uid}
                    settings={this.state.settings}
                    remoteData={this.state.dataSnapshot ? this.state.dataSnapshot.getPayload() : null}
                    uploadData={this.state.fileUploadData}
                    dataError={this.state.dataFetchError}
                    dataType={this.state.dataType}
                    widgets={this.props.widgets}
                    configItems={this.props.configItems}
                    onLoadUrl={this.refreshData}
                    onLoadButtonClick={this.loadButtonHandler}
                    onSettingsChanged={this.settingsChanged}
                    onFileUpload={this.localFileUploadHandler}
                />}
            </Container>
        );
    }
}

const Container = styled.div`
    display: block; 
    height: 100%;
    width: 100%;
    background-color: #262626;
`;

const LoadingIndicatorContainer = styled.div`
    float: left;
    display: inline-block;
    margin-top: 3px;
    margin-right: 10px;
`;

const ErrorBar = styled.div`    
    height: 10px;
    background-color: red;
    width: 100%;
`;

const FilterBox = styled.input`   
    float: left;
    height: 16px;
    margin-top: 2px;
    margin-right: 5px;
    width: 150px;
    background-color: black;
    color:white;
    border-radius: 2px;
    border: 1px solid #ccc;
    text-decoration: none;
    font-size: 10px;
`;

const ImageIcon = styled.img`  
    display: block;
    margin-top: 5%;
    margin-left: auto;
    margin-right: auto;
`;

const ErrorContainer = styled.div`
    top: 50%;
    left: 50%;
    text-align: center; 
`;

const ErrorText = styled.div`
    margin-left: 10px;
    margin-top: 20px;
    font-weight: 300;
    font-size: 1.1em;
    color: #929292;
`;


ChartWidgetContainer.propTypes = {
    dashboardName: PropTypes.string,
    showHeaders: PropTypes.bool,
    editing: PropTypes.bool,
    widgets: PropTypes.object,
    dataSnapshot: PropTypes.object,
    actions: PropTypes.object,
    glContainer: PropTypes.object,
    dataCache: PropTypes.object,
    refreshingUrls: PropTypes.array,
    configItems: PropTypes.array,
    userId: PropTypes.string
};

function mapStateToProps(state) {
    return {
        dashboardName: state.dashboard.name,
        widgets: state.dashboard.widgets,
        configItems: state.dashboard.configurationItems,
        showHeaders: state.dashboard.showHeaders,
        userId: state.admin.userId,
        dataCache: state.dashboard.dataCache,
        refreshingUrls: state.dashboard.refreshingUrls
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...widgetActions, ...dashActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartWidgetContainer);


