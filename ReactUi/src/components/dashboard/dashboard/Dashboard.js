/* eslint-disable */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { bindActionCreators } from "redux";
import * as widgetActions from "../../../actions/dashboardWidgetActions";
import * as dashboardActions from "../../../actions/dashboardActions";
import * as utils from "../../../functions/utils";
import DashboardSaveForm from "./DashboardSaveForm";
import DashboardRenameForm from "./DashboardRenameForm";
import * as constants from "../../../configuration/constants";
import {
    withRouter
} from 'react-router-dom';
import DashboardHeader from "./DashboardHeaderContainer";
import DashboardLayoutManager from "../../../functions/dashboard/DashboardLayoutManager";
import DashboardHistoryForm from "./DashboardHistoryForm";
import { shortUid } from "../../../functions/utils";


class Dashboard extends React.Component {

    static getDashboardMeta(key, name) {
        return {
            key: key,
            name: name,
            appType: "DASHBOARD",
            description: ""
        };
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            adminUser: null,
            newDashboard: true,
            isDirty: false,
            dashboardName: constants.UNTITLED_DASHBOARD_NAME,
            showRenameForm: false,
            showVersionHistory: false,
            showSaveForm: false,
            showShareForm: false,
            localDashboard: null
        };

        this.layoutManager = new DashboardLayoutManager();

        this.closeForm = this.closeForm.bind(this);
        this.generatePDF = this.generatePDF.bind(this);
        this.saveNewDashboard = this.saveNewDashboard.bind(this);
        this.dashboardUploaded = this.dashboardUploaded.bind(this);
        this.showVersionHistoryHandler = this.showVersionHistoryHandler.bind(this);
        this.saveAsDashboardMenuItemHandler = this.saveAsDashboardMenuItemHandler.bind(this);
        this.shareDashboardMenuItemHandler = this.shareDashboardMenuItemHandler.bind(this);
        this.shareDashboardHandler = this.shareDashboardHandler.bind(this);
        this.downloadDashboardLayout = this.downloadDashboardLayout.bind(this);
        this.renameDashboardHandler = this.renameDashboardHandler.bind(this);
        this.editPermissionsMenuItemHandler = this.editPermissionsMenuItemHandler.bind(this);
        this.dashboardRenameMenuItemHandler = this.dashboardRenameMenuItemHandler.bind(this);
        this.saveDashboardMenuItemHandler = this.saveDashboardMenuItemHandler.bind(this);
        this.forceComponentResize = this.forceComponentResize.bind(this);
    }

    componentDidMount() {
        this.setupGoldenLayout();
        if (this.props.savedDashboard) {
            this.setState({
                dashboardName: this.props.savedDashboard.name,
                newDashboard: false
            });
            this.props.actions.dashboardNameChanged(this.props.savedDashboard.name);
            if (this.props.savedDashboard.configurationItems) {
                let configItems = JSON.parse(this.props.savedDashboard.configurationItems);
                this.props.actions.updateDashboardConfigItems(configItems);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.dashboardName)
            document.title = this.state.dashboardName;
        
        this.completeIfRedirect();
        this.setAdminUser();
        this.fiddleLayout(prevProps);
        this.layoutManager.setWidgets(this.props.widgetControls);
    }

    componentWillUnmount() {
        if (this.state.layout) {
            this.state.layout.destroy();
            this.props.actions.resetDashboard();
        }
    }

    setupGoldenLayout() {
        if ((this.props.savedDashboard || this.state.localDashboard) && this.state.layout) {
            //reset layout
            this.state.layout.destroy();
            this.setState({ layout: null });
        }

        this.createGoldenLayout();
    }

    completeIfRedirect() {
        if (this.props.redirect) {
            this.props.history.push(this.props.redirect);
            this.props.actions.redirectCompleted();
        }
    }

    setAdminUser() {
        if (this.state.adminUser === null && this.props.appsByRole.Admin && this.props.savedDashboard) {
            let adminApp = this.props.appsByRole.Admin.find(app => app.key === this.props.savedDashboard.key);
            this.setState({ adminUser: !!adminApp });
        }
    }

    fiddleLayout(prevProps) {
        if (this.state.layout) {
            if (this.props.showDashboardSettings !== prevProps.showDashboardSettings) {
                let configOpened = this.state.layout.root.getItemsById("DashboardConfig").length > 0;
                if (!configOpened) {
                    this.layoutManager.showConfigPane();
                } else {
                    this.layoutManager.hideConfigPane();
                }
                this.state.layout.updateSize();
            }

            if (this.props.collapseConfigPane !== prevProps.collapseConfigPane) {
                this.layoutManager.collapseExpandConfigPane(this.props.collapseConfigPane);
            }

            if(this.props.appNavBarShowMenu !== prevProps.appNavBarShowMenu) {
                this.state.layout.updateSize();
            }
        }
    }

    createGoldenLayout() {
        let savedLayout = null;
        if (this.props.savedDashboard)
            savedLayout = this.props.savedDashboard.layout;
        else if (this.state.localDashboard)
            savedLayout = this.state.localDashboard.layout;

        this.layoutManager.createGoldenLayout(savedLayout,
            this.layoutContainer,
            this.context.store,
            () => this.setState({ isDirty: true }),
            this.forceComponentResize).then(layout => this.setState({ layout: layout }));
    }

    renameDashboardHandler(newName) {
        this.setState({
            dashboardName: newName,
            showRenameForm: false
        });
        this.props.actions.dashboardNameChanged(newName);
    }

    forceComponentResize(id) {
        this.props.actions.resizeWidgetComponents(shortUid(), id);
    }

    closeForm(formName) {
        this.setState({ ['show' + formName]: false });
    }

    getDashboardPayload(key, name) {
        let layout = JSON.stringify(this.state.layout.toConfig());
        let configItems = [];
        if (this.props.configurationItems) {
            configItems = this.props.configurationItems.slice(0);
            configItems.forEach(item => item.published = true);
        }
        let config = JSON.stringify(configItems);
        return {
            layout: layout,
            name: name,
            key: key,
            configurationItems: config,
            refreshInterval: this.props.refreshInterval,
            author: this.getUserDisplayName() + " (" + this.props.userId + ")"
        };
    }

    getVersionMeta(key, name) {
        return {
            appKey: key,
            tag: this.getNewVersion(),
            description: "",
            contentType: "JSON",
            fileName: name + '-' + this.props.userId + '.json'
        };
    }

    generatePDF() {
        utils.htmlToPDF('goldenLayoutDash', this.state.dashboardName);
    }

    getUserDisplayName() {
        let user = this.props.users.find((u) => u.username && u.username.toUpperCase() === this.props.userId.toUpperCase());
        return user ? (user.firstName + " " + user.lastName) : this.props.userId;
    }

    dashboardRenameMenuItemHandler(enabled) {
        if (!enabled) return;
        this.setState({ showRenameForm: true });
    }

    shareDashboardHandler(key, name, tag) {
        this.saveNewDashboard(key, name, tag, true);
    }

    saveAsDashboardMenuItemHandler(enabled) {
        if (!enabled) return;
        this.setState({ showSaveForm: true });
    }

    shareDashboardMenuItemHandler(enabled) {
        if (!enabled) return;
        if (!this.isSharedDashboard()) {
            this.setState({ showShareForm: true });
        } else {
            alert("This dashboard is already shared."); //should be never executed
        }
    }

    editPermissionsMenuItemHandler(enabled) {
        if (!enabled) return;
        this.props.history.push("/dashboard/permissions/" + this.props.savedDashboard.key);
    }

    showVersionHistoryHandler(enabled) {
        if (!enabled) return;
        this.setState({ showVersionHistory: true });
    }

    isSharedDashboard() {
        return this.getDashboardTags() && this.getDashboardTags().shared === "true";
    }

    getDashboardTag() {
        if (this.getDashboardTags() && this.getDashboardTags().tag) {
            return this.getDashboardTags().tag;
        }
        return null;
    }

    getDashboardTags() {
        if (!this.props.savedDashboard) return false;
        let currentApp = this.props.apps.find(a => a.key === this.props.savedDashboard.key);
        if (currentApp && currentApp.tags) {
            return currentApp.tags;
        }
        return null;
    }

    savedWithLocalData() {
        return this.getDashboardTags() && this.getDashboardTags().containsLocalData === "true";
    }

    getDashboardTimestamp() {
        if (this.getDashboardTags()) {
            let utcTime = this.getDashboardTags().timestamp;
            let utcDate = new Date(Number(utcTime));
            return utcDate.toLocaleTimeString() + ' ' + utcDate.toLocaleDateString();
        }
        return null;
    }

    containsUnsavedLocalData() {
        if (!this.props.savedDashboard) return false;
        let _this = this;
        let containsLocalData = false;
        Object.keys(this.props.widgets).forEach(key => {
            if (_this.props.widgets[key].containsLocalData === true)
                containsLocalData = true;
        });
        return containsLocalData;
    }

    saveDashboardMenuItemHandler(enabled) {
        if (!enabled) return;
        if (this.state.newDashboard) {
            this.setState({ showSaveForm: true });
        } else {
            this.updateDashboard();
        }
    }

    updateDashboard() {
        let name = this.state.dashboardName;
        let key = this.props.savedDashboard.key;
        let userDisplayName = this.getUserDisplayName() + " (" + this.props.userId + ")";
        let versionMeta = this.getVersionMeta(key, name);
        let dashboardPayload = this.getDashboardPayload(key, name);
        let dashboardMeta = Dashboard.getDashboardMeta(key, name);
        let d = new Date();
        dashboardPayload.author = this.props.savedDashboard.author;
        dashboardPayload.updatedBy = userDisplayName;
        dashboardMeta.description = "Updated by " + userDisplayName + " on " + d.toGMTString();
        dashboardMeta.tags = {
            shared: this.isSharedDashboard(),
            containsLocalData: this.containsUnsavedLocalData(),
            updatedBy: userDisplayName,
            timestamp: d.getTime(),
            tag: this.getDashboardTag()
        };
        versionMeta.description = dashboardMeta.description;
        versionMeta.tag = this.getNewVersion() + "";
        this.props.actions.updateDashboard(dashboardMeta, versionMeta,
            new Blob([JSON.stringify(dashboardPayload)], { type: "application/json" }));
    }

    saveNewDashboard(key, name, tag, shared = false) {
        let userDisplayName = this.getUserDisplayName() + " (" + this.props.userId + ")";
        let versionMeta = this.getVersionMeta(key, name);
        let dashboardPayload = this.getDashboardPayload(key, name);
        let dashboardMeta = Dashboard.getDashboardMeta(key, name);
        let d = new Date();
        dashboardPayload.author = userDisplayName;
        dashboardPayload.updatedBy = userDisplayName;
        dashboardMeta.description = "Updated by " + userDisplayName + " on " + d.toGMTString();
        dashboardMeta.tags = {
            shared: shared || this.isSharedDashboard(),
            containsLocalData: this.containsUnsavedLocalData(),
            updatedBy: userDisplayName,
            timestamp: d.getTime(),
            tag: tag
        };
        versionMeta.description = dashboardMeta.description;
        let jsonify = JSON.stringify(dashboardPayload);
        console.log(jsonify);
        this.props.actions.saveNewDashboard(dashboardMeta, versionMeta,
            jsonify,
            "/dashboard/" + key);

        this.setState({
            dashboardName: name,
            showSaveForm: false
        });
    }

    getNewVersion() {
        return new Date().getTime() + '';
    }

    downloadDashboardLayout(enabled) {
        if (!enabled) return;
        let key = this.props.savedDashboard ? this.props.savedDashboard : utils.shortUid();
        let dashboardPayload = this.getDashboardPayload(key, this.state.dashboardName);
        let blob = new Blob([JSON.stringify(dashboardPayload)], { type: "application/json" });
        utils.downloadFile(blob, this.state.dashboardName + '.json');
    }

    dashboardUploaded(rawData) {
        let dashboardPayload = JSON.parse(rawData);
        if (dashboardPayload) {
            this.setState({
                dashboardName: dashboardPayload.name,
                newDashboard: true,
                localDashboard: dashboardPayload
            });
            if (dashboardPayload.configurationItems) {
                let configItems = JSON.parse(dashboardPayload.configurationItems);
                this.props.actions.updateDashboardConfigItems(configItems);
            }
            this.setupGoldenLayout();
        }
    }

    render() {
        return (
            <Container >
                {!this.props.maximize &&
                    <DashboardHeader
                        adminUser={this.state.adminUser}
                        savedDashboard={this.props.savedDashboard}
                        isNewDashboard={this.state.newDashboard}
                        savedWithLocalData={this.savedWithLocalData()}
                        containsUnsavedLocalData={this.containsUnsavedLocalData()}
                        isDashboardDirty={this.state.isDirty}
                        dashboardName={this.state.dashboardName}
                        userDisplayName={this.getUserDisplayName()}
                        saving={this.props.saving}
                        sharedDashboard={this.isSharedDashboard()}
                        dashboardTimeStamp={this.getDashboardTimestamp()}
                        //funcs
                        onDashboardRename={this.dashboardRenameMenuItemHandler}
                        onDashboardSave={this.saveDashboardMenuItemHandler}
                        onDashboardSaveAs={this.saveAsDashboardMenuItemHandler}
                        onEditPermissions={this.editPermissionsMenuItemHandler}
                        onShowVersionHistory={this.showVersionHistoryHandler}
                        onDashboardShare={this.shareDashboardMenuItemHandler}
                        onDashboardDownload={this.downloadDashboardLayout}
                        onDashboardUpload={this.dashboardUploaded}
                        onGeneratePDF={this.generatePDF}
                    />}
                <div className="goldenLayout" id={'goldenLayoutDash'} ref={input => this.layoutContainer = input} style={this.props.maximize ?
                    GoldenLayoutShrinked : GoldenLayoutStyle} />
                <DashboardSaveForm
                    name="SaveForm"
                    dashboardName={this.state.dashboardName}
                    tag={this.getDashboardTag()}
                    show={this.state.showSaveForm}
                    onCancel={this.closeForm}
                    onSave={this.saveNewDashboard}
                />
                <DashboardSaveForm
                    name="ShareForm"
                    dashboardName={this.state.dashboardName}
                    show={this.state.showShareForm}
                    onCancel={this.closeForm}
                    onSave={this.shareDashboardHandler}
                />
                <DashboardRenameForm
                    name="RenameForm"
                    dashboardName={this.state.dashboardName}
                    show={this.state.showRenameForm}
                    onCancel={this.closeForm}
                    onOk={this.renameDashboardHandler}
                />
                <DashboardHistoryForm
                    name="VersionHistory"
                    versions={this.props.versions}
                    show={this.state.showVersionHistory}
                    onCancel={this.closeForm}
                    onOk={this.closeForm}
                />
            </Container>
        );
    }
}

Dashboard.contextTypes = {
    store: PropTypes.object.isRequired,
    savedDashboard: PropTypes.object,
    showHeaders: PropTypes.bool,
    widgetControls: PropTypes.object,
    widgets: PropTypes.array,
    versions: PropTypes.array,
    userId: PropTypes.string,
    users: PropTypes.array,
    saving: PropTypes.bool,
    redirect: PropTypes.bool,
    collapseConfigPane: PropTypes.bool,
    apps: PropTypes.array,
    appsByRole: PropTypes.array,
    configurationItems: PropTypes.array,
    history: PropTypes.array,
    maximize: PropTypes.bool,
    actions: PropTypes.object
};

const GoldenLayoutStyle = {
    height: "100%",
    width: "100%",
    position: "absolute",
    padding: "5px 5px 80px 5px"
};

const GoldenLayoutShrinked = {
    height: "100%",
    width: "100%",
    position: "absolute",
    padding: "5px 5px 10px 5px",
};

const Container = styled.div`  
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    background:black;
`;


function mapStateToProps(state) {
    return {
        widgetControls: state.dashboard.widgetControls,
        widgets: state.dashboard.widgets,
        versions: state.dashboard.dashboardVersions,
        showDashboardSettings: state.dashboard.showSettings,
        collapseConfigPane: state.dashboard.configPaneCollapsed,
        configurationItems: state.dashboard.configurationItems,
        userId: state.admin.userId,
        users: state.users,
        saving: state.dashboard.saving,
        redirect: state.dashboard.redirect,
        refreshInterval: state.dashboard.refreshInterval,
        apps: state.apps,
        appsByRole: state.appsByRole,
        maximize: state.dashboard.maximize,
        showHeaders: state.dashboard.showHeaders,
        appNavBarShowMenu: state.appNavBar.showMenu
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...widgetActions, ...dashboardActions }, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));

