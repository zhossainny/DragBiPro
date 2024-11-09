/* eslint-disable react/jsx-no-bind */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { bindActionCreators } from "redux";
import * as widgetActions from "../../../actions/dashboardWidgetActions";
import * as dashboardActions from "../../../actions/dashboardActions";
import '../../../css/dashboard.css';
import DashboardConfigurationItem from "./DashboardConfigurationItem";
import ReactDOM from "react-dom";
import NewConfigurationItemForm from "./NewConfigurationItemForm";

class DashboardConfigurationContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showNewConfigForm: false,
            configItems: props.configItems,
            itemToEdit: null
        };

        this.buildConfigItems = this.buildConfigItems.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.addOrUpdateItem = this.addOrUpdateItem.bind(this);
        this.itemChanged = this.itemChanged.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.editConfigItem = this.editConfigItem.bind(this);
        this.addButtonHandler = this.addButtonHandler.bind(this);
        this.collapseExpandPanel = this.collapseExpandPanel.bind(this);
        this.refreshDashboardData = this.refreshDashboardData.bind(this);
    }

    componentDidMount() {
        this.props.actions.collapseDashboardSettingsPane(!this.props.autoExpandSettings);
        if (this.props.glContainer) {
            this.props.glContainer.on('tab', tab => this.injectControlButtons());
        }
    }

    componentDidUpdate() {
        this.injectControlButtons();
    }

    editConfigItem(item) {
        this.setState({
            itemToEdit: item,
            showNewConfigForm: true
        });
    }

    itemChanged(item, valueChanged = true) {
        if (valueChanged) {
            this.addOrUpdateItem(item, true);
            this.props.actions.dashboardConfigurationChanged(true);
        }
    }

    buildConfigItems() {
        if (this.state.configItems) {
            return this.state.configItems.map((item) =>
                (<DashboardConfigurationItem
                    key={item.name}
                    item={item}
                    onItemChanged={this.itemChanged}
                    onEditItem={this.editConfigItem} />
                )
            );
        }
        return null;
    }

    addButtonHandler() {
        this.setState({ showNewConfigForm: true });
    }

    deleteItem(id) {
        let items = this.props.configItems.filter(item => item.id !== id);
        this.setState({
            itemToEdit: null,
            configItems: items,
            showNewConfigForm: false
        });
        this.props.actions.dashboardConfigurationChanged(true);
    }

    addOrUpdateItem(item, edited) {
        this.setState({ showNewConfigForm: false });
        item.published = false;
        let items = null;
        if (edited) {
            //let's put the edited item into the same location
            for (let i = 0; i < this.state.configItems.length; i++) {
                if (this.state.configItems[i].id === item.id) {
                    this.state.configItems[i] = item;
                    break;
                }
            }
            items = this.state.configItems.slice(0);
        } else {
            items = this.state.configItems.concat([item]);
        }
        this.props.actions.dashboardConfigurationChanged(true);
        this.setState({ configItems: items, itemToEdit: null });
    }

    closeForm(formName) {
        this.setState({
            ['show' + formName]: false,
            itemToEdit: null
        });
    }

    collapseExpandPanel() {
        this.props.actions.collapseDashboardSettingsPane(!this.props.collapsed);
    }

    refreshDashboardData() {
        let items = this.state.configItems.slice(0);
        items.forEach(item => item.published = true);
        this.props.actions.updateDashboardConfigItems(items);
        this.props.actions.updateDashboardData();
    }

    injectControlButtons() {
        if (!this.props.collapsed) {
            let id = this.props.glContainer.parent.config.id;
            let controls =
                (<span id={'widgetToolbox'}>
                    <button className="header-button"
                        style={this.getApplyButtonStyle()}
                        onClick={this.refreshDashboardData}>Apply</button>
                    <button className="header-button" onClick={this.addButtonHandler}>Add</button>
                    <button className="header-button-minimize" onClick={this.collapseExpandPanel}>
                        <i className="fa fa-minus" aria-hidden="true" style={{ verticalAlign: 'bottom' }} />
                    </button>
                </span>);
            ReactDOM.render(controls, this.props.glContainer.tab.header.controlsContainer[0].firstChild);
            this.props.actions.registerControls(id, controls);
            this.props.glContainer.tab.header.position(this.state.showHeaders);
        } else {
            this.props.glContainer.tab.header.position(false);
        }
    }

    getApplyButtonStyle() {
        if (!this.props.configurationChanged) return {};
        return {
            color: '#1b7329',
            border: '1px solid #0fab28',
            backgroundColor: 'orange'
        };
    }

    isVerticalAlign = () => this.props.glContainer.height > this.props.glContainer.width;

    render() {
        let items = this.buildConfigItems();
        if (this.props.collapsed) {
            return (
                <CollapsedContainer>
                    <button className={this.isVerticalAlign() ? "config-expand-button-transformed" : "config-expand-button"}
                        onClick={this.collapseExpandPanel}>
                        Configuration {!this.isVerticalAlign() && <i className="fa fa-expand" aria-hidden="true" style={{ marginLeft: '2px' }} />}
                    </button>
                </CollapsedContainer>
            );
        } else {
            return (
                <Container>
                    {items.length === 0 && <InfoLabel>Drag this to another window as a tab then add items (see right top) to control or filter the app.</InfoLabel>}
                    {items}
                    <NewConfigurationItemForm show={this.state.showNewConfigForm}
                        name={'NewConfigForm'}
                        onCancel={this.closeForm}
                        onOk={this.addOrUpdateItem}
                        item={this.state.itemToEdit}
                        deleteItem={this.deleteItem}
                    />
                </Container>
            );
        }
    }
}

DashboardConfigurationContainer.propTypes = {
    configItems: PropTypes.array,
    actions: PropTypes.object,
    glContainer: PropTypes.object,
    collapsed: PropTypes.bool,
    configurationChanged: PropTypes.bool,
    autoExpandSettings: PropTypes.bool
};

const CollapsedContainer = styled.div`
    display: block;
    height: 100%;
    width: 100%;
    padding: 5px;
    background-color: #262626;
`;

const Container = styled.div`
    display: block; 
    height: 100%;
    width: 100%;
    padding: 15px 0px 10px 5px;
    background-color: white;
    overflow: auto;
    background-color: #262626;
`;

const InfoLabel = styled.label`
    margin: 20px; 
    font-weight: 400;
    background-color: #262626;
`;

function mapStateToProps(state) {
    return {
        configItems: state.dashboard.configurationItems,
        collapsed: state.dashboard.configPaneCollapsed,
        configurationChanged: state.dashboard.configurationChanged,
        autoExpandSettings: state.dashboard.autoExpandSettings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...widgetActions, ...dashboardActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardConfigurationContainer);

