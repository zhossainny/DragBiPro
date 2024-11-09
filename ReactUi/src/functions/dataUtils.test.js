import * as dataUtils from './dataUtils';
import * as constants from "../configuration/constants";

describe("Test data formatting", () => {
    test('dollar format', () => {
        //Arrange/Act
        const rtnValue = dataUtils.formatMoney('249.678', 2, '$');
        //Assert
        expect(rtnValue).toBe('$249.68');
    });

    test('dollar format thousands', () => {
        //Arrange/Act
        const rtnValue = dataUtils.formatMoney('15000', 2, '$');
        //Assert
        expect(rtnValue).toBe('$15.00K');
    });

    test('dollar format millions', () => {
        //Arrange/Act
        const rtnValue = dataUtils.formatMoney('45222333', 2, '$');
        //Assert
        expect(rtnValue).toBe('$45.22M');
    });

    test('dollar format millions', () => {
        //Arrange/Act
        const rtnValue = dataUtils.formatMoney('45222333', 2, '$');
        //Assert
        expect(rtnValue).toBe('$45.22M');
    });

    test('small dollar value', () => {
        const rtnValue = dataUtils.formatMoney(0.00996579785352038, 4, '$');
        //Assert
        expect(rtnValue).toBe('$0.0100');
    });

    test('percentage format relative', () => {
        //Arrange/Act
        const rtnValue = dataUtils.formatValue('0.6578', '%', 2);
        //Assert
        expect(rtnValue).toBe('65.78%');
    });

    test('decimal format', () => {
        //Arrange/Act
        const rtnValue = dataUtils.formatValue('65.78', null, 2);
        //Assert
        expect(rtnValue).toBe('65.78');
    });

    test('handling nulls', () => {
        //Arrange/Act
        const rtnValue1 = dataUtils.formatValue(null, null, 2);
        const rtnValue2 = dataUtils.formatMoney(null, null, 2);
        //Assert
        expect(rtnValue1).toBe('');
        expect(rtnValue2).toBe('');
    });

});

describe("Test data type parsing", () => {

    test('JSON data type', () => {
        let data = '{ name: "Bob" }';
        //Arrange/Act
        const result = dataUtils.getDataType(data);
        //Assert
        expect(result).toEqual(constants.DATA_TYPE_JSON);
    });

    test('default data type', () => {
        let data = 'abc';
        //Arrange/Act
        const result = dataUtils.getDataType(data);
        //Assert
        expect(result).toEqual(constants.DATA_TYPE_CSV);
    });

    test('unknown data type', () => {
        let data = null;
        //Arrange/Act
        const result = dataUtils.getDataType(data);
        //Assert
        expect(result).toEqual(constants.DATA_TYPE_UNKNOWN);
    });

});

describe("Test CSV parsing", () => {

    let csv =   'Name,Age,Number\n' +
                'Bob,25,43534543\n' +
                'Tom ,34,3000039\n' +
                'John,23,3545435435\n';


    test('array CSV JSON format parsing', () => {
        //Arrange/Act
        const result = dataUtils.parseCSVasJson(csv);
        //Assert
        expect(result.length).toBe(3);
        expect(result[2].Name).toBe('John');
        expect(result[2].Age).toBe(23);
    });
});


describe('Test date parsing', () => {
    test('can convert one date format to another', () => {
        let result = dataUtils.formatDate('17-Oct-2018', 'YYYY-MM-DD');
        expect(result).toBe('2018-10-17');
    });

    test('uses default format if none applied', () => {
        let result = dataUtils.formatDate('17-Oct-2018', null);
        expect(result).toBe('17-10-2018 00:00:00');
    });
});