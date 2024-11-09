/* eslint-disable react/jsx-no-bind */
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {bindActionCreators} from "redux";
import * as widgetActions from "../../../actions/dashboardWidgetActions";
import * as dashboardActions from "../../../actions/dashboardActions";
import '../../../css/dashboard.css';
import DragIcon from '../../../images/drag.png';
import {Button, DropdownButton, MenuItem, ProgressBar} from "react-bootstrap";
import {ScaleLoader} from "react-spinners";
import DashboardVersionInfo from "./DashboardVersionInfo";
import DashboardAutoRefreshForm from "./DashboardAutoRefreshForm";
import {getDashboardUserFriendlyVersion} from "../../../functions/utils";
import logo from '../../../../src/images/logo.png'
import {FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {Navbar, Nav} from "react-bootstrap";

class DashboardHeaderContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            autoRefreshFormVisible: false,
            refreshing: false,
            dashboardUpdateLabel: null,
            dashboardUpdateProgress: 0
        };

        this.autoRefreshButtonHandler = this.autoRefreshButtonHandler.bind(this);
        this.toggleAutoRefreshForm = this.toggleAutoRefreshForm.bind(this);
        this.showSettingsButtonHandler = this.showSettingsButtonHandler.bind(this);
        this.setDashboardRefreshInterval = this.setDashboardRefreshInterval.bind(this);
        this.toggleHeaders = this.toggleHeaders.bind(this);
    }


    componentWillUnmount() {
        if (this._intervalId) clearInterval(this._intervalId);
        if (this._updateLabelIntervalId) clearInterval(this._updateLabelIntervalId);
    }

    toggleHeaders() {
        this.props.actions.toggleHeaders(!this.props.showHeaders);
    }

    toggleAutoRefreshForm() {
        this.setState({autoRefreshFormVisible: !this.state.autoRefreshFormVisible});
    }

    setDashboardRefreshInterval(interval) {
        this.props.actions.setUpdateInterval(interval);
        this.toggleAutoRefreshForm();
    }

    autoRefreshButtonHandler() {
        if (this.state.refreshing) {
            this.stopAutoRefresh();
        } else {
            this.startAutoRefresh();
        }
    }

    showSettingsButtonHandler() {
       this.props.actions.showDashboardSettingsPane(!this.props.dashboardSettingsVisible);
    }

    updateDashboardProgress() {
        if (this.lastUpdate) {
            let seconds = (new Date() - this.lastUpdate) / 1000;
            let interval = Number(seconds).toFixed(0);
            let suffix = 's';
            if (interval > 60) {
                interval = Number(interval/60).toFixed(1);
                suffix = 'm';
            }
            this.setState({
                dashboardUpdateLabel: interval+suffix,
                dashboardUpdateProgress: (seconds/this.props.refreshInterval)*100
            });
        }
    }

    startAutoRefresh() {
        if (!this._intervalId) {
            this.props.actions.updateDashboardData();
            this.lastUpdate = new Date();
            this.updateDashboardProgress();
            let refreshInterval = this.props.refreshInterval ? this.props.refreshInterval : 30;
            let this_ = this;
            this._intervalId = setInterval(() => {
                this_.props.actions.updateDashboardData();
                this_.lastUpdate = new Date();
            }, refreshInterval * 1000);
            this._updateLabelIntervalId = setInterval(() => {
                this_.updateDashboardProgress();
            }, 2000);
            this.setState({refreshing: true});
        }
    }

    stopAutoRefresh() {
        if (this._intervalId) {
            this.lastUpdate = null;
            clearInterval(this._intervalId);
            clearInterval(this._updateLabelIntervalId);
            this.setState({
                dashboardUpdateLabel: null,
                refreshing: false,
                dashboardUpdateProgress: 0
            });
            this._intervalId = null;
            this._updateLabelIntervalId = null;
        }
    }

    parseLocalFile(files) {
        let reader = new FileReader();
        reader.onload = () => {
            this.props.onDashboardUpload (reader.result);
        };
        reader.readAsBinaryString(files[0]);
        $('#Menu').click();
        $('.dashUpload').val(null); //allows to re-upload same file multi times
    }
    toggleFullscreen() {
        if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    render() {
        let admin = this.props.adminUser;
        let canRename = this.props.savedDashboard && admin;
        let canSave = (this.props.isNewDashboard && this.props.isDashboardDirty) || admin;
        let canSaveAs = !!this.props.savedDashboard;
        let canShare = !this.props.sharedDashboard && admin && !this.props.savedWithLocalData && !this.props.containsUnsavedLocalData;
        let canEditPermissions = !this.props.isNewDashboard && this.props.sharedDashboard && admin;

        return (
            <DashboardHeader>&nbsp;
                <ImageIcon src={logo} width="84" height="30" alt="dragBi logo"/>&nbsp;&nbsp;&nbsp;
                <label style={{color:'white'}}> Drag options: </label>&nbsp;
                {/*<ButtonDrag id="newWidgetDrag"><i className={"fa fa-arrow-down"}/> Drag Me</ButtonDrag>*/}
                <ButtonDrag id="newGridDrag"><i className={"fa fa-arrow-down"}/>Grid</ButtonDrag>
                <ButtonDrag id="newChartDrag"><i className={"fa fa-arrow-down"}/>Chart</ButtonDrag>
                <ButtonDrag id="newMetricDrag"><i className={"fa fa-arrow-down"}/>Metric</ButtonDrag>
                <ButtonDrag id="newPercentageDrag"><i className={"fa fa-arrow-down"}/>Percent</ButtonDrag>
                <ButtonDrag id="newiFrameDrag"><i className={"fa fa-arrow-down"}/>iFrame</ButtonDrag>
                <label style={{color:'white'}}> Click: </label>&nbsp;
                <ButtonOther id="controller" onClick={this.showSettingsButtonHandler}>controller</ButtonOther>
                <ButtonOther id="header" onClick={this.toggleHeaders}><i className="fas fa-heading"></i>Hide/Show</ButtonOther>
                <ButtonOther id="fullscr" onClick={this.toggleFullscreen}>FullScr</ButtonOther>
                <DropdownButton variant="success" title="File &nbsp;" id = "Menu" style={dropdownStyle}>
                    <MenuItem disabled={!canSave} onClick={() => this.props.onDashboardSave(canSave)}>Save</MenuItem>
                    <MenuItem disabled={!canSaveAs} onClick={() => this.props.onDashboardSaveAs(canSaveAs)}>Save As...</MenuItem>
                    <MenuItem disabled={!canShare} onClick={() => this.props.onDashboardShare(canShare)}>Share</MenuItem>
                    <MenuItem disabled={!canRename} onClick={() => this.props.onDashboardRename(canRename)}>Rename</MenuItem>
                </DropdownButton>&nbsp;&nbsp;
                <DropdownButton variant="success" title="Tools &nbsp;" id = "Menu2" style={dropdownStyle}>

                    {/*<MenuItem onClick={this.showSettingsButtonHandler}>Configuration</MenuItem>*/}
                    <MenuItem disabled={!canEditPermissions} onClick={() => this.props.onEditPermissions(canEditPermissions)}>Access Control</MenuItem>
                    <MenuItem onClick={this.toggleAutoRefreshForm}>Data pull Interval</MenuItem>
                    <MenuItem disabled={!canSave} onClick={() => this.props.onDashboardDownload(canSave)}>Download App</MenuItem>
                    <input type={"file"} name="dashUpload" id="dashUpload" className="dashUpload"
                           accept=".json"
                           onChange={(e) => this.parseLocalFile(e.target.files)}/>
                    <label htmlFor="dashUpload">
                        Upload App
                    </label>
                    <MenuItem onClick={() => this.props.onGeneratePDF(true)}>Generate PDF</MenuItem>
                    {/*<MenuItem onClick={this.toggleHeaders}>Toggle Headers</MenuItem>*/}
                    {/*<MenuItem onClick={this.props.onShowVersionHistory}>History</MenuItem>*/}
                </DropdownButton>
                {this.props.isDashboardDirty &&
                    <ButtonStreamingUpdates onClick={this.autoRefreshButtonHandler}>
                        <i className={this.state.refreshing ? 'fa fa-pause' : 'fa fa-play'}/>
                    </ButtonStreamingUpdates>
                }
                <DashboardCaption><i className={"fa fa-save fa-lg"}/>
                    <span style={{verticalAlign: "middle", marginLeft: "10px", color:'white'}}>
                            {this.props.dashboardName}
                        </span>
                </DashboardCaption>
                {this.props.saving && <SpinnerContainer>
                    <ScaleLoader size={15} height={20}  color={"#F39318"}/>
                </SpinnerContainer>}
                {this.state.refreshing && !this.props.saving &&
                <DashboardUpdateContainer>
                    <UpdateProgress now={this.state.dashboardUpdateProgress} bsStyle="warning"/>
                    <DashboardUpdateLabel>Updated: <b>{this.state.dashboardUpdateLabel}</b> ago</DashboardUpdateLabel>
                </DashboardUpdateContainer>}
                <DashboardVersionInfo
                    version={this.props.isNewDashboard ? "0" : getDashboardUserFriendlyVersion(this.props.savedDashboard.version, this.props.dashboardVersions)}
                    updatedBy={this.props.isNewDashboard ? this.props.userDisplayName : this.props.savedDashboard.updatedBy}
                    timestamp={this.props.dashboardTimeStamp ? this.props.dashboardTimeStamp : (new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString())}
                    shared = {this.props.sharedDashboard}
                />
                {this.state.autoRefreshFormVisible &&
                <DashboardAutoRefreshForm currentInterval={this.props.refreshInterval}
                                          onCancel={this.toggleAutoRefreshForm}
                                          onOk={this.setDashboardRefreshInterval}/>}
            </DashboardHeader>
        );
    }
}

DashboardHeaderContainer.propTypes = {
    dashboardName: PropTypes.string.isRequired,
    userDisplayName: PropTypes.string,
    isNewDashboard: PropTypes.bool,
    savedWithLocalData: PropTypes.bool,
    containsUnsavedLocalData: PropTypes.bool,
    adminUser: PropTypes.bool,
    saving: PropTypes.bool,
    dashboardVersions: PropTypes.array,
    dashboardSettingsVisible: PropTypes.bool,
    refreshInterval: PropTypes.number,
    showHeaders: PropTypes.bool,
    sharedDashboard: PropTypes.bool,
    isDashboardDirty: PropTypes.bool,
    savedDashboard: PropTypes.object,
    dashboardTimeStamp: PropTypes.string,
    actions: PropTypes.object,
    onShowVersionHistory: PropTypes.func,
    onDashboardRename: PropTypes.func,
    onDashboardSave: PropTypes.func,
    onDashboardSaveAs: PropTypes.func,
    onDashboardShare: PropTypes.func,
    onEditPermissions: PropTypes.func,
    onDashboardDownload: PropTypes.func,
    onDashboardUpload: PropTypes.func,
    onGeneratePDF: PropTypes.func
};


const DashboardHeader = styled.div` 
    display: inline-block;
    width: 100%;
    background: #262626;
`;

const SpinnerContainer = styled.div`
    display: inline-block;
    margin-left: 30px;
    padding-top: 28px;
    position: absolute
`;

const DashboardCaption = styled.label`    
    margin: 10px 10px 5px 10px;
    font-size: 1.5em;
    font-weight: 300;
    color: rgb(66, 82, 110);
    display: inline-block;
`;

const MenuButton = styled(DropdownButton)`    
    background-image: none;
    background-color: #fff;
    border-color: #ccc;
    border-radius: 3px;
    border: 1px solid #ccc;
    min-width: 70px;
    padding: 5px 8px;
    font-size: 0.9em;
    text-decoration: none;
    display: inline-block;
    &:hover  {
        background-color: #f1f1f1};      
    }
`;

const ButtonDrag = styled(Button)`
    background-image: none;
    background-color: #ff9005;
    color:white;
    border-color: #ccc;
    border-radius: 45px;
    border: 1px solid #ccc;
    min-width: 70px;

    font-size: 1em;
    text-decoration: none;
    display: inline-block;
    margin: 0px 10px 5px 5px;
    cursor: move;
    box-shadow: 0px 8px 15px rgba(128,0, 128, 0.1);
  transition: all 0.3s ease 0s;
    &:hover  {
        box-shadow: 0px 15px 20px rgba(186, 52, 235, 0.4);
        background-color: #8ea5ff;   
        transform: translateY(4px);   
    }
`;
const ButtonOther = styled(Button)`
    background-image: none;
    background-color: #800080;
    color:white;
    border-color: #ccc;
    border-radius: 3px;
    border: 1px solid #ccc;
    min-width: 70px;

    font-size: 1em;
    text-decoration: none;
    display: inline-block;
    margin: 0px 10px 5px 5px;
    box-shadow: 0px 8px 15px rgba(128,0, 128, 0.1);
  transition: all 0.3s ease 0s;
    &:hover  {
        box-shadow: 0px 15px 20px rgba(186, 52, 235, 0.4);
        background-color: #660066;   
    }
    &:focus {
        background-color: #660066;   
    }
`;

const ButtonStreamingUpdates = styled(Button)`
    background-image: none;
    background-color: purple;
    color: white;
    border-color: #ccc;
    border-radius: 3px;
    border: 1px solid #ccc;
    min-width: 40px;

    font-size: 0.9em;
    text-decoration: none;
    display: inline-block;
    margin: 0px 10px 5px 10px;
    &:hover  {
        background-color: #993299};      
    }
    &:focus {
        background-color: #993299;
    }
`;

const UpdateProgress = styled(ProgressBar)`
    margin: 0px;
    height: 2px;
    background-color: orange;
`;

const DashboardUpdateLabel = styled.label`   
    font-size: 0.8em;
    font-weight: 400;
    color: darkgray;
    text-align: left;
    display: inline-block;
`;

const DashboardUpdateContainer = styled.div` 
    display: inline-block;
    margin-top: 36px;
    position: absolute;
`;

const ImageIcon = styled.img`  
    margin-top: -3px;
    margin-left: 10px;
    margin-right: 5px;
`;
const dropdownStyle = {
    background:'#601390',
    color: 'white'
};

function mapStateToProps(state) {
    return {
        showHeaders: state.dashboard.showHeaders,
        dashboardSettingsVisible: state.dashboard.showSettings,
        refreshInterval: state.dashboard.refreshInterval,
        dashboardVersions: state.dashboard.dashboardVersions
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...widgetActions, ...dashboardActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHeaderContainer);

