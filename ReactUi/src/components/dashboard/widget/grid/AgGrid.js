/* eslint-disable react/no-did-update-set-state,react/jsx-boolean-value */
import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import styled from 'styled-components';
import "ag-grid-enterprise";
import * as gridUtils from "../../../../functions/dashboard/agGridUtils";
import ViewEditor from "./viewEditor/ViewEditor";
import { AG_GRID_ROW_HEIGHT } from "../../../../configuration/constants";
import ConditionalFormatEditor from "./conditionalFormatting/ConditionalFormatEditor";
import GroupRowFormatEditor from './GroupRowFormatEditor';
import * as math from 'mathjs';
import { getCaption } from '../charts/chartHelpers';
import * as _ from 'lodash';
import { setAMinusSetB } from '../../../../functions/utils';
import { hasGroupColumn } from './../../../../functions/dashboard/agGridUtils';
import "ag-grid-enterprise/chartsModule";

class AgGrid extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            gridReady: false,
            viewEditorVisible: false,
            conditionalFormatEditorVisible: false,
            groupRowEditorVisible: false,
            selectedColumn: null
        };
        this.viewVersion = null;
        this.onGridReady = this.onGridReady.bind(this);
        this.publishGridStateChange = this.publishGridStateChange.bind(this);
        this.viewChangedHandler = this.viewChangedHandler.bind(this);
        this.cellDoubleClicked = this.cellDoubleClicked.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let viewChanged = (this.viewVersion === null && this.props.settings.view) ||
            (this.props.settings.view && this.viewVersion !== this.props.settings.view.version);
        if (viewChanged)
            this.viewVersion = this.props.settings.view.version;
        if (prevProps.dataSource.version !== this.props.dataSource.version || viewChanged) {
            this.updateGridDataSource();
        }
        if (this.gridApi) {
            this.gridApi.setQuickFilter(this.props.settings.filterText);
            if (this.props.loading) {
                this.gridApi.showLoadingOverlay();
            }
            else if (this.props.dataSource &&
                this.props.dataSource.rows &&
                this.props.dataSource.rows.length !== 0) {
                this.gridApi.hideOverlay();
            }
        }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.setState({ gridReady: true });
        this.updateGridDataSource();
        let _this = this;
        // global event listener for anything related to columns
        this.gridApi.addGlobalListener(function (type) {
            if (type.indexOf('column') >= 0 && type.indexOf('Hover') === -1) {
                _this.publishGridStateChange();
            }
        });
    }

    cellDoubleClicked(params) {
        if (params.colDef.type === 'numericColumn') return;
        this.props.onGridDataFilterChanged(params.value);
    }

    publishGridStateChange() {
        let newGridState = this.getCurrentGridState();
        this.props.onGridVisualStateChanged(newGridState);
    }

    viewChangedHandler(view) {
        this.props.onViewChanged(view);
        this.setState({ viewEditorVisible: false, selectedColumn: null });
    }

    conditionalFormatsChangedHandler = formatting => {
        this.props.onConditionalFormattingChanged(formatting);
        this.setState({ conditionalFormatEditorVisible: false });
    }

    groupRowFormatChanged = format => {
        this.props.onGroupRowFormattingChanged(format);
        this.setState({ groupRowEditorVisible: false });
    }

    getContextMenuItems = params => {
        let customMenuItems = [{
            name: "Edit View",
            action: () => this.setState({ viewEditorVisible: true })
        }, {
            name: "Conditional Formatting",
            action: () => this.setState({ conditionalFormatEditorVisible: true })
        }, {
            name: "Group Row Formatting",
            action: () => this.setState({ groupRowEditorVisible: true })
        }];
        if (params.column) {
            customMenuItems.unshift({
                name: "Format '" + params.column.colDef.headerName + "' Column",
                action: () => this.setState({
                    viewEditorVisible: true,
                    selectedColumn: params.column.colDef
                })
            });
        }
        let standardMenuItems = [
            'separator',
            'expandAll',
            'contractAll',
            'copy',
            'copyWithHeaders',
            'paste',
            'resetColumns',
            'export',
            'chartRange'
        ];
        return customMenuItems.concat(standardMenuItems);
    }

    getRowStyle = params => {
        if (params.node.group && this.props.settings.groupRowFormatting) {
            const { backgroundColor } = this.props.settings.groupRowFormatting;
            if (backgroundColor) {
                const { r, g, b, a } = backgroundColor;
                const newAlpha = math.chain(a).divide(params.node.level + 1).round(2).done();
                return { background: gridUtils.toStringRGBA({ r, g, b, a: newAlpha }) };
            }
        }
    }

    getDataPath = data => {
        return data[this.props.settings.treeData.pathProperty];
    }

    getGroupColumnDefinition() {
        let def = {
            cellClass: "font-size-" + this.props.settings.fontSize
        };
        let columnProps = gridUtils.getColumnProps(this.props.settings, 'Group');
        if (columnProps && columnProps.caption) {
            def.headerName = columnProps.caption;
        }
        return def;
    }

    columnResized = e => {
        if (e.column) {
            const columnProps = gridUtils.getColumnProps(this.props.settings, e.column.colId);
            if (columnProps && columnProps.dataBar) {
                this.gridApi.refreshCells({ columns: [e.column.colId], force: true });
            }
        }
    }

    getDefaultColDef() {
        return {
            sortable: true,
            filter: true,
            resizable: true,
            headerComponentParams: {
                template: //don't change! Tags should stay empty..
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    '    <span ref="eText" class="ag-header-cell-text' + ' font-size-' + this.props.settings.fontSize + '" role="columnheader"></span>' +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>'
            }
        };
    }

    closeViewEditor = () => this.setState({ viewEditorVisible: false, selectedColumn: null });

    closeGroupRowEditor = () => this.setState({ groupRowEditorVisible: false });

    closeConditionalFormatEditor = () => this.setState({ conditionalFormatEditorVisible: false });

    updateGridDataSource() {
        if (this.gridApi) {
            if (this.props.dataSource && this.props.dataSource.columnDefs && this.props.dataSource.columnDefs.length) {
                this.gridApi.setColumnDefs([]);
                this.gridApi.setColumnDefs(this.props.dataSource.columnDefs);
                this.restoreState();
            }

            if (this.props.dataSource && this.props.dataSource.rows) {
                this.gridApi.setRowData(this.props.dataSource.rows);
                this.setPinnedTotalRow();
            }
        }
    }

    setPinnedTotalRow = () => {
        if (this.hasTotalRowEnabled() && this.hasPinnedTotalRow()) {
            let valueColumns = this.gridColumnApi.getValueColumns();
            let allColumns = this.gridColumnApi.getAllDisplayedColumns().map(column => column.colId);
            let pinnedRow = {};
            allColumns.forEach(column => {
                let matchingColumn = valueColumns.find(col => col.colId === column);
                if (matchingColumn) {
                    let displayedValues = [];
                    this.gridApi.forEachNodeAfterFilter(node => {
                        if (node && node.data) {
                            displayedValues.push(node.data[column]);
                        }
                    });
                    pinnedRow[column] = this.gridApi.aggFuncService.aggFuncsMap[matchingColumn.aggFunc](displayedValues);
                } else {
                    pinnedRow[column] = '';
                }
            });

            this.gridApi.setPinnedBottomRowData([pinnedRow]);
        }
    }


    reArrangeColumns = (columnState) => {
        let columnsFromServer = this.props.dataSource.columnDefs.map(column => column.headerName);
        let columnsFromState = columnState.columnLayout.map(column => column.colId);
        let columnDiff = Array.from(setAMinusSetB(columnsFromServer, columnsFromState));
        if (columnDiff.length) {
            this.gridColumnApi.setColumnsVisible(columnDiff, true);
        }
        if (this.props.settings.columnOrderFromServer) {
            this.gridColumnApi.moveColumns(columnsFromServer, hasGroupColumn(this.gridColumnApi) ? 1 : 0);

        } else {
            this.gridColumnApi.moveColumns(columnDiff, this.props.dataSource.columnDefs.length - 1);
        }
    }

    restoreState() {
        let state = _.cloneDeep(this.props.settings.gridVisualState);
        if (state && state.columnLayout) {
            this.gridColumnApi.setPivotMode(state.pivotMode);
            this.gridColumnApi.setColumnState(state.columnLayout);
            if (state.columnGroupLayout && state.columnGroupLayout.length)
                this.gridColumnApi.setColumnGroupState(state.columnGroupLayout);
            this.gridApi.setSortModel(state.sortModel);
            this.gridApi.setFilterModel(state.filterModel);
            this.gridApi.onFilterChanged();
            this.reArrangeColumns(state);
        }
    }

    getCurrentGridState() {
        try {
            let state = {
                columnLayout: this.gridColumnApi.getColumnState(),
                columnGroupLayout: this.gridColumnApi.getColumnGroupState(),
                pivotMode: this.gridColumnApi.isPivotMode(),
                sortModel: this.gridApi.getSortModel(),
                filterModel: this.gridApi.getFilterModel()
            };
            let valueColumns = gridUtils.extractValueColumns(this.gridColumnApi);
            if (valueColumns.length > 0)
                state.valueColumns = valueColumns;
            return state;
        }
        catch (e) {
            console.log('Failed to get grid temp state. ' + e.text);
            return null;
        }
    }

    getExcelExportProps() {
        return {
            columnGroups: true,
            fileName: 'Dashboard - ' + this.props.dashboardName + ' - ' + this.props.title,
            sheetName: this.props.title
        };
    }

    enableTreeData = gridProps => {
        if (this.props.settings.treeData && this.props.settings.treeData.enabled && this.props.dataSource.rows && this.props.dataSource.rows.length && _.isArray(this.props.dataSource.rows[0][this.props.settings.treeData.pathProperty])) {
            gridProps.treeData = true;
            gridProps.getDataPath = this.getDataPath;
        }
    }

    enableTotalRow = gridProps => {
        if (this.hasTotalRowEnabled()) {
            if (this.hasPinnedTotalRow()) {
                gridProps.onColumnValueChanged = this.setPinnedTotalRow;
                gridProps.onColumnVisible = this.setPinnedTotalRow;
                gridProps.onFilterChanged = () => {
                    this.setPinnedTotalRow();
                    this.publishGridStateChange();
                };
            } else {
                gridProps.groupIncludeTotalFooter = true;
            }
        }
    }

    enableColumnResize = gridProps => {
        let resizableColumns = false;
        _.forOwn(gridUtils.getColumnProps(this.props.settings), (value, key) => {
            if (value.dataBar) {
                resizableColumns = true;
            }
        });

        if (resizableColumns) {
            gridProps.onColumnResized = _.debounce(this.columnResized, 200);
        }
    }

    hasPinnedTotalRow = () => _.has(this.props.settings, 'totals.pinToBottom') && this.props.settings.totals.pinToBottom;

    hasTotalRowEnabled = () => _.has(this.props.settings, 'totals.enabled') && this.props.settings.totals.enabled;

    render() {
        let rowHeight = this.props.settings.rowHeight ? this.props.settings.rowHeight : AG_GRID_ROW_HEIGHT;
        let caption = getCaption(this.props.settings.caption, this.props.configItems);
        let coreGridProps = {
            className: "grid-container",
            rowHeight,
            rememberGroupStateWhenNewData: true,
            defaultColDef: this.getDefaultColDef(),
            sideBar: { toolPanels: ['columns'] },
            autoGroupColumnDef: this.getGroupColumnDefinition(),
            onGridReady: this.onGridReady,
            onSortChanged: this.publishGridStateChange,
            onFilterChanged: this.publishGridStateChange,
            onRowDataChanged: this.publishGridStateChange,
            onCellDoubleClicked: this.cellDoubleClicked,
            getContextMenuItems: this.getContextMenuItems,
            getRowStyle: this.getRowStyle,
            enableCharts:true,
            enableRangeSelection:true,
            defaultExportParams: this.getExcelExportProps()
        };
        this.enableTreeData(coreGridProps);
        this.enableTotalRow(coreGridProps);
        this.enableColumnResize(coreGridProps);

        return (
            <Container className={"ag-theme-balham-dark"} id={'agGrid_' + this.props.id}>
                {caption ? <Caption>{caption}</Caption> : null}
                <GridContainer>
                    <AgGridReact {...coreGridProps} />
                </GridContainer>
                <ViewEditor show={this.state.viewEditorVisible}
                    onCancel={this.closeViewEditor}
                    onOk={this.viewChangedHandler}
                    columnDefinitions={this.props.dataSource.columnDefs}
                    defaultSettings={this.props.settings}
                    selectedColumn={this.state.selectedColumn}
                />
                <GroupRowFormatEditor
                    show={this.state.groupRowEditorVisible}
                    onOk={this.groupRowFormatChanged}
                    onCancel={this.closeGroupRowEditor}
                    options={this.props.settings.groupRowFormatting}
                />
                <ConditionalFormatEditor show={this.state.conditionalFormatEditorVisible}
                    onCancel={this.closeConditionalFormatEditor}
                    onOk={this.conditionalFormatsChangedHandler}
                    columnDefinitions={this.props.dataSource.columnDefs}
                    defaultSettings={this.props.settings}
                    selectedColumn={this.state.selectedColumn}
                />
            </Container>
        );
    }
}

AgGrid.propTypes = {
    id: PropTypes.string,
    dataSource: PropTypes.object,
    title: PropTypes.string,
    dashboardName: PropTypes.string,
    settings: PropTypes.object,
    loading: PropTypes.bool,
    configItems: PropTypes.array,
    onGridVisualStateChanged: PropTypes.func,
    onGridDataFilterChanged: PropTypes.func,
    onViewChanged: PropTypes.func,
    onConditionalFormattingChanged: PropTypes.func,
    onGroupRowFormattingChanged: PropTypes.func
};

export default AgGrid;

const GridContainer = styled.div`
    flex: 1 1 auto;
`;

const Container = styled.div`
    height: 100%;
    width: 100%;  
    display: flex;
    flex-direction: column;
`;

const Caption = styled.h3`
    color: deeppink;
    text-align: center;
    margin: 0;
    padding: 8px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

