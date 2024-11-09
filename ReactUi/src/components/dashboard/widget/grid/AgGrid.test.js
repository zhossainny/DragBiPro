import React from 'react';
import { shallow } from 'enzyme';
import AgGrid from './AgGrid';
import sinon from 'sinon';
import { gridApiStub, gridColumnApiStub } from '../../../../../test/agGridHelpers';
import { AG_GRID_AUTO_COLUMN } from '../../../../configuration/constants';

jest.mock('ag-grid-enterprise');
let clock, gridApi, gridColumnApi;


describe('AgGrid test', () => {
    beforeEach(() => {
        clock = sinon.useFakeTimers();
        gridApi = gridApiStub();
        gridColumnApi = gridColumnApiStub();
    });

    test('should produce correct style for level 0 group row', () => {
        const props = { settings: { groupRowFormatting: { backgroundColor: { r: 55, g: 54, b: 53, a: 1 } } }, dataSource: {} };
        const wrapper = shallow(<AgGrid {...props} />);

        const rowStyle = wrapper.find('AgGridReact').prop('getRowStyle')({ node: { group: true, level: 0 } });
        expect(rowStyle).toEqual({ background: 'rgba(55, 54, 53, 1)' });
    });

    test('should produce correct style for level 1 group row', () => {
        const props = { settings: { groupRowFormatting: { backgroundColor: { r: 55, g: 54, b: 53, a: 1 } } }, dataSource: {} };
        const wrapper = shallow(<AgGrid {...props} />);

        const rowStyle = wrapper.find('AgGridReact').prop('getRowStyle')({ node: { group: true, level: 1 } });
        expect(rowStyle).toEqual({ background: 'rgba(55, 54, 53, 0.5)' });
    });

    test('should produce correct style for level 2 group row', () => {
        const props = { settings: { groupRowFormatting: { backgroundColor: { r: 55, g: 54, b: 53, a: 1 } } }, dataSource: {} };
        const wrapper = shallow(<AgGrid {...props} />);

        const rowStyle = wrapper.find('AgGridReact').prop('getRowStyle')({ node: { group: true, level: 2 } });
        expect(rowStyle).toEqual({ background: 'rgba(55, 54, 53, 0.33)' });
    });

    test('should not produce style if backgroundColor not defined', () => {
        const props = { settings: { groupRowFormatting: null }, dataSource: {} };
        const wrapper = shallow(<AgGrid {...props} />);

        const rowStyle = wrapper.find('AgGridReact').prop('getRowStyle')({ node: { group: true, level: 1 } });
        expect(rowStyle).toBeUndefined();
    });

    test('should not produce style if not a group row', () => {
        const props = { settings: { groupRowFormatting: { backgroundColor: { r: 55, g: 54, b: 53, a: 1 } } }, dataSource: {} };
        const wrapper = shallow(<AgGrid {...props} />);

        const rowStyle = wrapper.find('AgGridReact').prop('getRowStyle')({ node: { group: false } });
        expect(rowStyle).toBeUndefined();
    });

    test('should call setColumnDefs if data source has definitions', () => {
        const props = { settings: {}, dataSource: { version: 1, columnDefs: [{ colId: '1', name: 'column 1' }] } };
        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: sinon.stub() });
        wrapper.setProps({ dataSource: { version: 2, columnDefs: [{ colId: '1', name: 'column 1' }] } });

        expect(gridApi.setColumnDefs.calledWith([{ colId: '1', name: 'column 1' }])).toBe(true);
    });

    test('should not call setColumnDefs if data source doen\'t have any definitions', () => {
        const props = { settings: {}, dataSource: { version: 1, columnDefs: [] } };
        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: sinon.stub() });
        wrapper.setProps({ dataSource: { version: 2 } });

        expect(gridApi.setColumnDefs.called).toBe(false);
    });

    test('should add new columns to end of set', () => {
        const props = { settings: { gridVisualState: { columnLayout: [{ colId: 'column 2' }] } }, dataSource: { version: 1, columnDefs: [{ headerName: 'column 1' }, { headerName: 'column 2' }] } };
        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: gridColumnApi });

        expect(gridColumnApi.setColumnsVisible.calledWith(['column 1'], true)).toBe(true);
        expect(gridColumnApi.moveColumns.calledWith(['column 1'], 1)).toBe(true);
    });

    test('should set grid title when matching config items', () => {
        const props = { settings: { groupRowFormatting: null, caption: '{CCY} yearly PNL' }, dataSource: {}, configItems: [{ name: 'CCY', value: 'EUR' }] };
        const wrapper = shallow(<AgGrid {...props} />);

        expect(wrapper.find('AgGrid__Caption').dive().text()).toBe('EUR YEARLY PNL');
    });

    test('should not display heading if no caption', () => {
        const props = { settings: { groupRowFormatting: null }, dataSource: {}, configItems: [{ name: 'CCY', value: 'EUR' }] };
        const wrapper = shallow(<AgGrid {...props} />);

        expect(wrapper.find('AgGrid__Caption').length).toBe(0);
    });

    test('should fire force refreshCell when column has dataBar', () => {
        const props = { settings: { view: { columnProperties: { notional: { dataBar: true } } } }, dataSource: { version: 1, columnDefs: [] } };
        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: sinon.stub() });
        wrapper.find('AgGridReact').prop('onColumnResized')({ column: { colId: 'notional' } });
        clock.tick(200);

        expect(gridApi.refreshCells.calledWith({ columns: ['notional'], force: true })).toBeTruthy();
    });

    test('should enable tree data', () => {
        const props = { settings: { treeData: { enabled: true, pathProperty: 'columnX' } }, dataSource: { rows: [{ columnX: ['level1', 'level2'] }] }, configItems: [] };
        const wrapper = shallow(<AgGrid {...props} />);

        expect(wrapper.find('AgGridReact').prop('treeData')).toBe(true);
        expect(wrapper.find('AgGridReact').prop('getDataPath')).toBeDefined();
    });

    test('should resolve tree data path correctly according to settings', () => {
        const props = { settings: { treeData: { enabled: true, pathProperty: 'columnX' } }, dataSource: { rows: [{ columnX: ['level1', 'level2'] }] }, configItems: [] };
        const wrapper = shallow(<AgGrid {...props} />);

        expect(wrapper.find('AgGridReact').prop('getDataPath')({ columnY: 123, columnX: 567 })).toBe(567);
    });

    test('should enable total row via old setting', () => {
        const props = { settings: { totals: { enabled: true } }, dataSource: { rows: [{ columnX: ['level1', 'level2'] }] }, configItems: [] };
        const wrapper = shallow(<AgGrid {...props} />);

        expect(wrapper.find('AgGridReact').prop('onColumnValueChanged')).toBeUndefined();
        expect(wrapper.find('AgGridReact').prop('onColumnVisible')).toBeUndefined();
        expect(wrapper.find('AgGridReact').prop('groupIncludeTotalFooter')).toBe(true);
    });

    test('should enable total row via new setting', () => {
        const props = { settings: { totals: { enabled: true } }, dataSource: { rows: [{ columnX: ['level1', 'level2'] }] }, configItems: [] };
        const wrapper = shallow(<AgGrid {...props} />);

        expect(wrapper.find('AgGridReact').prop('onColumnValueChanged')).toBeUndefined();
        expect(wrapper.find('AgGridReact').prop('onColumnVisible')).toBeUndefined();
        expect(wrapper.find('AgGridReact').prop('groupIncludeTotalFooter')).toBe(true);
    });


    test('should calculate totals row correctly', () => {
        const props = { settings: { totals: { enabled: true, pinToBottom: true } }, dataSource: { rows: [{ columnX: ['level1', 'level2'] }] }, configItems: [] };
        const allColumns = [{ colId: 'column1' }, { colId: 'column2' }, { colId: 'column3' }];
        const valueColumns = [{ colId: 'column2', aggFunc: 'sum' }, { colId: 'column3', aggFunc: 'sum' }];
        const displayedNodes = [{ data: { column1: 3, column2: 2, column3: 5 } }, { data: { column1: 10, column2: 11, column3: 2 } }];
        gridColumnApi.getAllDisplayedColumns.returns(allColumns);
        gridColumnApi.getValueColumns.returns(valueColumns);
        gridApi.forEachNodeAfterFilter.callsFake(iterator => displayedNodes.forEach(node => iterator(node)));
        sinon.stub(gridApi.aggFuncService, 'aggFuncsMap').get(() => ({ sum: values => values.reduce((prev, next) => prev + next) }));

        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: gridColumnApi });
        expect(gridApi.setPinnedBottomRowData.calledWith([{ column1: '', column2: 13, column3: 7 }])).toBe(true);
    });

    test('should calculate totals row correctly when no value columns displayed', () => {
        const props = { settings: { totals: { enabled: true, pinToBottom: true } }, dataSource: { rows: [{ columnX: ['level1', 'level2'] }] }, configItems: [] };
        const allColumns = [{ colId: 'column1' }, { colId: 'column5' }, { colId: 'column6' }];
        const valueColumns = [{ colId: 'column2', aggFunc: 'sum' }, { colId: 'column3', aggFunc: 'sum' }];
        gridColumnApi.getAllDisplayedColumns.returns(allColumns);
        gridColumnApi.getValueColumns.returns(valueColumns);

        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: gridColumnApi });
        expect(gridApi.setPinnedBottomRowData.calledWith([{ column1: '', column5: '', column6: '' }])).toBe(true);
    });

    test('should apply column order from data source when required', () => {
        const props = { settings: { columnOrderFromServer: true, gridVisualState: { columnLayout: [{ colId: 'column 2' }, { colId: 'column 1' }] } }, dataSource: { version: 1, columnDefs: [{ headerName: 'column 1' }, { headerName: 'column 2' }] } };
        gridColumnApi.getAllDisplayedColumns.returns([{ colId: 'column 1' }, { colId: 'column 2' }]);
        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: gridColumnApi });


        expect(gridColumnApi.moveColumns.calledWith(['column 1', 'column 2'], 0)).toBe(true);
    });

    test('should apply column order from data source when required and takes in consideration group column', () => {
        const props = { settings: { columnOrderFromServer: true, gridVisualState: { columnLayout: [{ colId: 'column 2' }, { colId: 'column 1' }] } }, dataSource: { version: 1, columnDefs: [{ headerName: 'column 1' }, { headerName: 'column 2' }] } };
        gridColumnApi.getAllDisplayedColumns.returns([{ colId: AG_GRID_AUTO_COLUMN }, { colId: 'column 1' }, { colId: 'column 2' }]);
        const wrapper = shallow(<AgGrid {...props} />);

        wrapper.find('AgGridReact').prop('onGridReady')({ api: gridApi, columnApi: gridColumnApi });


        expect(gridColumnApi.moveColumns.calledWith(['column 1', 'column 2'], 1)).toBe(true);
    });


}); 