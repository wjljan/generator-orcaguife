import {formatStorageSize, formatNetworkSize, formatTimeLeft, formatTime, randomNumberBoth, getCapacityColour, someUpperCase} from 'Services';

describe('Format service', () => {
    it('Format storage size', () => {
        formatStorageSize();
        formatStorageSize('abc');
        formatStorageSize(0);
        formatStorageSize(NaN);
        formatStorageSize(9999);
        formatStorageSize(9999, 2, true);
        formatNetworkSize(0.5, 2, true);
    });

    it('Format network size', () => {
        formatNetworkSize();
        formatNetworkSize('abc');
        formatNetworkSize(0);
        formatNetworkSize(NaN);
        formatNetworkSize(9999);
        formatNetworkSize(9999, 2, true);
        formatNetworkSize(0.5, 2, true);
    });

    it('Format left time', () => {
        formatTimeLeft(999999);
    });

    it('Format time', () => {
        formatTime('2019-03-05T00:00:09');
    });

    it('Random number both', () => {
        randomNumberBoth(1, 5);
    });

    it('Get capacity color', () => {
        getCapacityColour('76%');
        getCapacityColour('51%');
        getCapacityColour('26%');
        getCapacityColour('10%');
    });

    it('Some chars upper case', () => {
        someUpperCase('abc');
        someUpperCase('abc', 1);
        someUpperCase('abc', [1]);
    });
});