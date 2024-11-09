import GoldenLayout from "golden-layout";
import DashboardWidget from "../../components/dashboard/widget/DashboardWidgetContainer";
import GridWidget from  "../../components/dashboard/widget/grid/GridWidgetContainer";
import ChartWidget from  "../../components/dashboard/widget/charts/ChartWidgetContainer";
import MetricWidget from  "../../components/dashboard/widget/metrics/MetricWidgetContainer";
import PercentageWidget from  "../../components/dashboard/widget/percentagePie/PercentageWidgetContainer";
import iFrameWidget from  "../../components/dashboard/widget/iframe/iFrameWidgetContainer";
import DashboardConfigurationPane from "../../components/dashboard/configuration/DashboardConfigurationContainer";
import * as utils from "../utils";
import ReactDOM from "react-dom";
import React from "react";
import { Provider } from 'react-redux';

const newItemConfig = {
    title: 'New Report',
    type: 'react-component',
    component: 'dashboard-widget',
    id: null,
    state: null
};
const newGridItemConfig = {
    title: 'New Grid Edit',
    type: 'react-component',
    component: 'grid-widget',
    id: null,
    state: null
};
const newChartItemConfig = {
    title: 'New Chart Edit',
    type: 'react-component',
    component: 'chart-widget',
    id: null,
    state: null
};
const newMetricItemConfig = {
    title: 'New Metric Edit',
    type: 'react-component',
    component: 'metric-widget',
    id: null,
    state: null
};
const newPercentageItemConfig = {
    title: 'New Percentage Edit',
    type: 'react-component',
    component: 'percentage-widget',
    id: null,
    state: null
};
const newiFrameItemConfig = {
    title: 'New iFrame Edit',
    type: 'react-component',
    component: 'iframe-widget',
    id: null,
    state: null
};

const layoutConfig = {
    settings: {
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: true
    },
    content: []
};

const settingsConfig = {
    title: 'Controller',
    type: 'react-component',
    component: 'dashboard-config',
    id: 'DashboardConfig',
    state: null
};

class DashboardLayoutManager {


    constructor() {
        this.registeredWidgets = [];
    }

    initialized() {
        return !!this.layout;
    }

    showConfigPane() {
        if (!this.initialized()) {
            return;
        }

        let wrapper = {
            type: 'column',
            content: [settingsConfig]
        };
        let itemCount = this.layout.root.contentItems.length;
        if (itemCount === 0)
            setTimeout(() => this.layout.root.addChild(wrapper), 0);
        else
            setTimeout(() => this.layout.root.contentItems[itemCount - 1].addChild(settingsConfig));
    }

    hideConfigPane() {
        if (!this.initialized()) {
            return;
        }
        let matches = this.layout.root.getItemsById("DashboardConfig");
        let configWidget = matches[0];
        configWidget.remove();
    }

    collapseExpandConfigPane(collapse) {
        if (!this.initialized()) {
            return;
        }
        let matches = this.layout.root.getItemsById("DashboardConfig");
        if (matches.length === 0) return;
        let configWidget = matches[0];
        if (collapse) {
            //ugly code below because of some bugs in GoldenL.
            if (typeof this.configCollapsed !== 'undefined') {
                this.configPaneSize = {
                    width: configWidget.container.width,
                    height: configWidget.container.height
                };
                configWidget.container.setSize(32, 26);
            }
            else if (typeof this.configCollapsed === 'undefined' && configWidget.container.width > configWidget.container.height) {
                console.log(); //do nothing
            } else {
                configWidget.container.setSize(32, 26);
            }
            configWidget.tab.header.position(false);
        } else {
            if (this.configPaneSize && (this.configPaneSize.width < 400 || this.configPaneSize.height < 400)) {
                let width = this.configPaneSize.width;
                let height = this.configPaneSize.height + 16;
                if (height < 220) height = 220;
                if (width < 230) width = 230;
                configWidget.container.setSize(width, height); //weird offset is happening in horizontal mode
            }
            else {
                if (configWidget.container.width > configWidget.container.height) {
                    configWidget.container.setSize(configWidget.container.width, 220);
                } else {
                    configWidget.container.setSize(230, configWidget.container.height);
                }
            }
            configWidget.tab.header.position(true);
        }
        this.configCollapsed = collapse;
        this.layout.updateSize();
    }

    createGoldenLayout(savedLayout,
        htmlContainer,
        store,
        markDirty,
        triggerComponentResize) {

        return new Promise(resolve => {
            let _this = this;
            setTimeout(() => {
                let layout = this.generateLayout.bind(_this)(savedLayout, htmlContainer, store, markDirty, triggerComponentResize);
                resolve(layout);
            }, 0);
        });
    }

    generateLayout(savedLayout,
        htmlContainer,
        store,
        markDirty,
        triggerComponentResize) {
        this.resizeComponents = triggerComponentResize;

        let layout = new GoldenLayout(savedLayout ?
            JSON.parse(savedLayout) :
            layoutConfig, htmlContainer);

        layout.registerComponent('dashboard-widget',
            this.wrapComponent(DashboardWidget, store)
        );
        //added
        layout.registerComponent('grid-widget',
            this.wrapComponent(GridWidget, store)
        );
        layout.registerComponent('chart-widget',
            this.wrapComponent(ChartWidget, store)
        );
        layout.registerComponent('metric-widget',
            this.wrapComponent(MetricWidget, store)
        );
        layout.registerComponent('percentage-widget',
            this.wrapComponent(PercentageWidget, store)
        );
        layout.registerComponent('iframe-widget',
            this.wrapComponent(iFrameWidget, store)
        );

        layout.registerComponent('dashboard-config',
            this.wrapComponent(DashboardConfigurationPane, store)
        );

        window.addEventListener('resize', this.onResize.bind(this));
        layout.createDragSource($('#newWidgetDrag'), newItemConfig);
        layout.createDragSource($('#newGridDrag'), newGridItemConfig);
        layout.createDragSource($('#newChartDrag'), newChartItemConfig);
        layout.createDragSource($('#newMetricDrag'), newMetricItemConfig);
        layout.createDragSource($('#newPercentageDrag'), newPercentageItemConfig);
        layout.createDragSource($('#newiFrameDrag'), newiFrameItemConfig);
        layout.on('componentCreated', this.onComponentCreated.bind(this, markDirty));
        layout.on('activeContentItemChanged', this.onActiveContentItemChanged.bind(this));
        layout.on('stackCreated', this.onStackCreated.bind(this));

        try {
            layout.init();
        } catch (e) {
            console.error('Failed to initialize Golden Layout. ' + e.message, e.stack);
        }
        this.layout = layout;
        return layout;

    }

    setWidgets(widgets) {
        this._widgets = widgets;
    }

    getControlType(component) {
        return component.config.state ? component.config.state.settings.controlType : null;
    }

    onResize() {
        this.layout.updateSize();
        $.each($('.lm_header'), function (i, header) {
            if (header.offsetWidth < 265 && !header.innerText.includes(settingsConfig.title)) {
                $(header).find('#widgetToolbox').addClass('hidden');
            } else {
                $(header).find('#widgetToolbox').removeClass('hidden');
            }
        });
    }

    onComponentCreated(markDirty, component) {
        if (!component.config.id)
            component.config.id = utils.shortUid();
        markDirty();
    }

    onStackCreated(stack) {
        let div = document.createElement('div');
        div.setAttribute("class", 'widgetControlContainer');
        stack.header.controlsContainer.prepend(div);

        stack.header.controlsContainer.find('.lm_maximise').click(function (e) {
            if (e.currentTarget.title === 'maximise') {
                this.layout.updateSize();
            }
        });
    }

    onActiveContentItemChanged(component) {
        if (this.getControlType(component) === 'chart' && component.tab.isActive && this.resizeComponents) {
            this.resizeComponents(component.config.id);
        }

        let container = component.tab.contentItem.container;
        if (component.config.id !== settingsConfig.id && !this.registeredWidgets.includes(component.config.id)) {
            this.registeredWidgets.push(component.config.id);
            container.on('resize', e => {
                if (this.resizeComponents && component.tab.isActive && this.getControlType(component) === 'chart')
                    this.resizeComponents(component.config.id);
            });
        }
        let id = component.config.id;
        if (id && this._widgets && component.tab && component.tab.isActive) {
            let widget = this._widgets.find(control => control.id === id);
            if (widget) {
                ReactDOM.render(widget.controls, component.tab.header.controlsContainer[0].firstChild);
            }
        }
    }

    wrapComponent(Component, store) {
        class Wrapped extends React.Component {
            render() {
                return (
                    <Provider store={store}>
                        <Component {...this.props} />
                    </Provider>
                );
            }
        }
        return Wrapped;
    }
}

export default DashboardLayoutManager;