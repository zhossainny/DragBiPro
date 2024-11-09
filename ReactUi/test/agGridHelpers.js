import sinon from 'sinon';

export function gridApiStub() {
    return sinon.stub({
        setQuickFilter: () => { },
        addGlobalListener: () => { },
        setColumnDefs: () => { },
        refreshCells: () => { },
        setSortModel: () => { },
        setFilterModel: () => { },
        onFilterChanged: () => { },
        forEachNodeAfterFilter: () => { },
        aggFuncService: { aggFuncsMap: {} },
        setPinnedBottomRowData: () => { },
        hideOverlay: () => { },
        setRowData: () => { }
    });
}

export function gridColumnApiStub() {
    return sinon.stub({
        setColumnsVisible: () => { },
        moveColumns: () => { },
        setPivotMode: () => { },
        setColumnState: () => { },
        getValueColumns: () => { },
        getAllDisplayedColumns: () => { }
    });
}