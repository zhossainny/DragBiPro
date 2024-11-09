import * as dataUtils from "../dataUtils";

class WidgetFilterManager {

    constructor(widgets, configItems) {
        this._widgets = widgets;
        this._configItems = configItems;
    }

    getDataFilters(masterWidgetId, masterDetailFilterDefinition, configurationFilters, appliedDataFilters) {
        let dataFilters = null;
        let mdFilter = null;

        if (masterWidgetId && masterDetailFilterDefinition && masterDetailFilterDefinition.field) {
            let masterWidget = this._widgets[masterWidgetId];
            if (masterWidget && masterWidget.publishedFilterValue && this._masterFilterChanged(masterWidget.title, masterWidget.publishedFilterValue, appliedDataFilters)) {
                mdFilter = Object.assign({}, masterDetailFilterDefinition);
                mdFilter.type = 'master-detail';
                mdFilter.masterWidgetName = masterWidget.title;
                mdFilter.value = masterWidget.publishedFilterValue;
                if (appliedDataFilters && appliedDataFilters.length > 0) {
                    dataFilters = [mdFilter].concat(appliedDataFilters.filter(filter => filter.type !== 'master-detail'));
                } else {
                    dataFilters = [mdFilter];
                }
            }
        }

        if (configurationFilters && configurationFilters.length > 0) {
            if (this._configFiltersChanged(configurationFilters, appliedDataFilters)) {
                let filters =  configurationFilters.map(filter => {
                    let item = this._configItems.find(item => item.name === filter.configItemName);
                    if (item && filter.field) {
                        return {
                            name: item.name,
                            field: filter.field,
                            value: item.value,
                            type: 'config',
                            version: item.version
                        };
                    }
                    return null;
                });
                filters = filters.filter(f => !!f);
                dataFilters = mdFilter ? filters.concat([mdFilter]) : filters;
            }
        }
        return dataFilters;
    }

    _masterFilterChanged(masterWidgetName, newValue, appliedDataFilters) {
        if (!appliedDataFilters) return true;
        let currentVersion = appliedDataFilters.find(appliedFilter => appliedFilter.masterWidgetName === masterWidgetName);
        if (!currentVersion) return true;
        return currentVersion.value !== newValue;
    }

    _configFiltersChanged(configurationFilters, appliedDataFilters) {
        let validFilters = configurationFilters.filter(x=> x.field && x.value);
        let matchingConfigItems = [];
        for (let filter  of validFilters) {
            let configItem = this._configItems.find(x=> x.name === filter.configItemName);
            if (configItem) {
                matchingConfigItems.push(configItem);
            }
        }
        if (matchingConfigItems.length === 0) return false; //nothing to apply

        //filter added/removed
        if (appliedDataFilters && appliedDataFilters.length > 0) {
            let appliedConfigFilterCount = appliedDataFilters.filter(x => x.type === 'config').length;
            if (appliedConfigFilterCount !== matchingConfigItems.length) return true;
        } else {
            return true;
        }
        //filter modified
        for (let configItem of matchingConfigItems) {
            let appliedFilter = appliedDataFilters.find(x=> x.configItemName === configItem.name);
            if (appliedFilter && appliedFilter.value !== configItem.value) return true;
        }
        return false;
    }
}

export default WidgetFilterManager;