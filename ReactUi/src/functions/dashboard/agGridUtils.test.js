import { buildRows } from './agGridUtils';

describe('agGridUtils tests', () => {
    it('should build numeric data with absolute sort', () => {
        const allRows = [[1, 'cherries'], [-2, 'bananas']];
        const columnDefinitions = [{ field: 'column 1' }, { field: 'column 2' }];
        const gridSettings = { view: { columnProperties: { 'column 1': { type: 'numeric', absoluteSort: true }, 'column 2': { type: 'numeric' } } } };

        buildRows(allRows, columnDefinitions, gridSettings);
        expect(columnDefinitions[0].comparator).not.toBeNull();
        expect(columnDefinitions[0].comparator(-4, 2)).toBe(1);
    });

    it('should build numeric data without sort customisation', () => {
        const allRows = [[1, 'cherries'], [-2, 'bananas']];
        const columnDefinitions = [{ field: 'column 1' }, { field: 'column 2' }];
        const gridSettings = { view: { columnProperties: { 'column 1': { type: 'numeric', absoluteSort: false }, 'column 2': { type: 'numeric' } } } };

        buildRows(allRows, columnDefinitions, gridSettings);
        expect(columnDefinitions[0].comparator).toBeNull();
    });
});