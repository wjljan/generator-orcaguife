import {lsGet, lsRemove, lsClearAll} from 'Services';

describe('LocalStorage service', () => {
    it('LocalStorage get', () => {
        localStorage.setItem('a', '}');
        lsGet('a');
        lsGet(['a']);
    });

    it('LocalStorage remove', () => {
        lsRemove('a');
    });

    it('LocalStorage clear all', () => {
        lsClearAll();
    });
});