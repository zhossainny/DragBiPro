
export function resetSavedState(savedState) {
    savedState.gridDataSource.version = 0;
    savedState.chartDataSource.version = 0;
    savedState.metricDataSource.version = 0;
    savedState.restoredState = true;
    return savedState;
}

export function getDefaultState(widgetId) {
    return {
        uid: widgetId,
        widgetControlsRegistered: false,
        restoredState: false,
        fileUploadData: null,
        showHeaders: true,
        localFileId: null,
        dataLoading: false,
        dataFetchError: null,
        dataSnapshot: null,
        dataType: null,
        gridDataSource: {
            version: 0,
            columnDefs: null,
            rows: null,
            filtered: false
        },
        chartDataSource: {
            version: 0,
            data: null,
            filtered: false
        },
        metricDataSource: {
            version: 0,
            data: null
        },
        settings: {
            url: null,
            urlArgs: [],
            title: null,
            controlType: null,
            jsonPropertyPath: null,
            jsonProperties: [],
            masterWidget: null,
            dataFilter: {
                masterWidgetName: null,
                field: null,
                value: null
            },
            configurationFilters: [{
                configItemName: null,
                field: null,
                value: null
            }],
            percentage: {
                caption: null,
                path: null
            },
            metric: {
                paths: [],
                type: 'numeric',
                caption: null,
                formatter: '$',
                decimalPrecision: 2,
                formatNumbers: true,
                invertColors: false,
                colorFormat: true,
                fontSize: 'l'
            },
            chart: {
                caption: null,
                x: null,
                yOptions: [{y: null, type: null}],
                type: "line",
                sortXAxis: false,
                enabled3d:true,
                alpha:0,
                beta:-30,
                series: null,
                columnNames: null,
                tooltipItems: []
            },
            grid: {
                gridVisualState: {
                    columnLayout: null,
                    sortModel: null,
                    filterModel: null,
                    pivotMode: false,
                    valueColumns: []
                },
                fontSize: "m",
                decimalPrecision: 2,
                rowHeight: 26,
                filterText: null,
                formatDollar: false,
                view: null,
                conditionalFormatting: {version: 0, formats: []}
            }
        }
    };
}

