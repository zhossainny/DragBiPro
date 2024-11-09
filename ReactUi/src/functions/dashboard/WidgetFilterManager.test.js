import WidgetFilterManager from "./WidgetFilterManager";


test('Should return no data filters is no filters present', () => {
    let manager = new WidgetFilterManager([], []);
    let masterWidgetName = 'master';
    let appliedDataFilters = [{}];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, null, [], appliedDataFilters);
    //Assert
    expect(result).toBeNull();
});

test('Should return only master filter if no config filter set', () => {
    let manager = new WidgetFilterManager({
        master: {
            publishedFilterValue: 'USD'
        }
    }, []);
    let masterWidgetName = 'master';
    let masterFilter = {
        field: 'ccy',
        value: 'USD'
    };
    let appliedDataFilters = [{
        masterWidgetName: 'master',
        value: 'USD',
        type: 'master-detail'
    }];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, masterFilter, [], appliedDataFilters);
    //Assert
    expect(result.length).toBe(1);
});

test('Should return only config filters if no master filter defined', () => {
    let manager = new WidgetFilterManager([], [{ name: 'ccy_filter', value: 'ZAR' }]);
    let masterWidgetName = 'master';
    let appliedDataFilters = [{
        value: 'USD',
        type: 'config',
        configItemName: 'ccy_filter'
    }];
    let configFilters = [{ field: 'ccy', value: 'ZAR', configItemName: 'ccy_filter' }];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, null, configFilters, appliedDataFilters);
    //Assert
    expect(result.length).toBe(1);
});

test('Should return filters of both types when they are present', () => {
    let manager = new WidgetFilterManager({
        master: {
            publishedFilterValue: 'USD',
            title: 'master'
        }
    }, [{ name: 'ccy_filter', value: 'ZAR' }]);
    let masterWidgetName = 'master';
    let masterFilter = {
        field: 'ccy',
        value: 'USD'
    };
    let appliedDataFilters = [
        {
            value: 'USD',
            type: 'config',
            name: 'ccy_filter',
            configItemName: 'ccy_filter'
        },
        {
            masterWidgetName: 'master',
            value: 'ZAR',
            type: 'master-detail'
        }
    ];
    let configFilters = [{ field: 'ccy', value: 'ZAR', configItemName: 'ccy_filter' }];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, masterFilter, configFilters, appliedDataFilters);
    //Assert
    expect(result.length).toBe(2);
});


test('Should detect if a filter was removed', () => {
    let manager = new WidgetFilterManager({
        master: {
            publishedFilterValue: 'USD',
            title: 'master'
        }
    }, [{ name: 'ccy_filter', value: 'ZAR' }]);
    let masterWidgetName = 'master';
    let masterFilter = {
        field: 'ccy',
        value: 'USD'
    };
    let appliedDataFilters = [
        {
            value: 'USD',
            type: 'config',
            name: 'ccy_filter',
            configItemName: 'ccy_filter'
        },
        {
            value: 'VOD.L',
            type: 'config',
            name: 'ticker_filter',
            configItemName: 'ticker_filter'
        },
        {
            masterWidgetName: 'master',
            value: 'ZAR',
            type: 'master-detail'
        }
    ];
    let configFilters = [{ field: 'ccy_filter', value: 'USD', configItemName: 'ccy_filter' }];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, masterFilter, configFilters, appliedDataFilters);
    //Assert
    expect(result.length).toBe(2);
});

test('Should detect if a filter was added', () => {
    let manager = new WidgetFilterManager({
        master: {
            publishedFilterValue: 'USD',
            title: 'master'
        }
    }, [{ name: 'ccy_filter', value: 'ZAR' }, { name: 'ticker_filter', value: 'VOD.L' }]);
    let masterWidgetName = 'master';
    let masterFilter = {
        field: 'ccy',
        value: 'USD'
    };
    let appliedDataFilters = [
        {
            value: 'USD',
            type: 'config',
            name: 'ccy_filter',
            configItemName: 'ccy_filter'
        },
        {
            masterWidgetName: 'master',
            value: 'ZAR',
            type: 'master-detail'
        }
    ];
    let configFilters = [{ field: 'ccy_filter', value: 'USD', configItemName: 'ccy_filter' }, { field: 'ticker_filter', value: 'VOD.L', configItemName: 'ticker_filter' }];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, masterFilter, configFilters, appliedDataFilters);
    //Assert
    expect(result.length).toBe(3);
});

test('Should detect if a filter value was changed', () => {
    let manager = new WidgetFilterManager({
        master: {
            publishedFilterValue: 'USD',
            title: 'master'
        }
    }, [{ name: 'ccy_filter', value: 'GBP' }]);
    let masterWidgetName = 'master';
    let masterFilter = {
        field: 'ccy',
        value: 'USD'
    };
    let appliedDataFilters = [
        {
            value: 'USD',
            type: 'config',
            name: 'ccy_filter',
            configItemName: 'ccy_filter'
        },
        {
            masterWidgetName: 'master',
            value: 'ZAR',
            type: 'master-detail'
        }
    ];
    let configFilters = [{ field: 'ccy', value: 'ZAR', configItemName: 'ccy_filter' }];

    //Arrange/Act
    const result = manager.getDataFilters(masterWidgetName, masterFilter, configFilters, appliedDataFilters);
    //Assert
    expect(result.length).toBe(2);
    let ccyFilter = result.find(x => x.field === 'ccy');
    expect(ccyFilter).toEqual(expect.objectContaining({ value: 'GBP' }));
});


test('Filter not set', () => {
    let manager = new WidgetFilterManager([], []);
    let masterWidgetName = 'master';
    let newValue = 'GBP';
    let appliedDataFilters = [{}];

    //Arrange/Act
    const result = manager._masterFilterChanged(masterWidgetName, newValue, appliedDataFilters);
    //Assert
    expect(result).toBeTruthy();
});

test('Filter set with different value', () => {
    let manager = new WidgetFilterManager([], []);
    let masterWidgetName = 'master';
    let newValue = 'GBP';
    let appliedDataFilters = [{
        masterWidgetName: 'master',
        value: 'USD'
    }];

    //Arrange/Act
    const result = manager._masterFilterChanged(masterWidgetName, newValue, appliedDataFilters);
    //Assert
    expect(result).toBeTruthy();
});

test('Filter set with same value', () => {
    let manager = new WidgetFilterManager([], []);
    let masterWidgetName = 'master';
    let newValue = 'GBP';
    let appliedDataFilters = [{
        masterWidgetName: 'master',
        value: 'GBP'
    }];

    //Arrange/Act
    const result = manager._masterFilterChanged(masterWidgetName, newValue, appliedDataFilters);
    //Assert
    expect(result).toBe(false);
});


test('No valid filters', () => {
    let manager = new WidgetFilterManager([], []);
    let appliedDataFilters = [{}];

    //Arrange/Act
    const result = manager._configFiltersChanged([{ field: 'empty' }], appliedDataFilters);
    //Assert
    expect(result).toBe(false);
});

test('Filter not applied', () => {
    let manager = new WidgetFilterManager([], [{ name: 'ccy_filter', value: 'USD' }]);
    let appliedDataFilters = [];

    //Arrange/Act
    const result = manager._configFiltersChanged([{ field: 'ccy', value: 'GBP', configItemName: 'ccy_filter' }], appliedDataFilters);
    //Assert
    expect(result).toBeTruthy();
});

test('Filter value changed', () => {
    let manager = new WidgetFilterManager([], [{ name: 'ccy_filter', value: 'ZAR' }]);
    let appliedDataFilters = [{ type: 'config', field: 'ccy', value: 'USD', configItemName: 'ccy_filter' }];

    //Arrange/Act
    const result = manager._configFiltersChanged([{ field: 'ccy', value: 'ZAR', configItemName: 'ccy_filter' }], appliedDataFilters);
    //Assert
    expect(result).toBeTruthy();
});

test('Filter value is same', () => {
    let manager = new WidgetFilterManager([], [{ name: 'ccy_filter', value: 'ZAR' }]);
    let appliedDataFilters = [{ type: 'config', field: 'ccy', value: 'ZAR', configItemName: 'ccy_filter' }];

    //Arrange/Act
    const result = manager._configFiltersChanged([{ field: 'ccy', value: 'ZAR', configItemName: 'ccy_filter' }], appliedDataFilters);
    //Assert
    expect(result).toBe(false);
});
