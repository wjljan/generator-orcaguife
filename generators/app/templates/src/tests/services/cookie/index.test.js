import {ckSet, ckRemove, getSystemStatusInCookie} from 'Services';

describe('Cookie service', () => {
    it('Set cookie', () => {
        ckSet('init', true);
        ckSet('login', true);
        ckSet('deinit', false);
        ckSet('recover', false);
        ckSet('reinit', false);
        ckSet('rollbacking', false);
        ckSet('setparam', false);
        ckSet('clusterconfigexport', false);
    });

    it('Get cookie', () => {
        // Get by string.
        let isInit = getSystemStatusInCookie('init');
        expect(isInit).toBe(true);
        // Get by array.
        let arr = getSystemStatusInCookie(['init', 'login']);
        expect(JSON.stringify(arr)).toBe('[true,true]');
        // Get all.
        let allSystemStatus = getSystemStatusInCookie();
        expect(JSON.stringify(allSystemStatus)).toBe('{"isInitialized":true,"isLogin":true,"isDeInit":false,"isRecover":false,"isReInit":false,"isRollingBack":false,"isSettingParam":false,"isClusterConfigExporting":false}');
        allSystemStatus = getSystemStatusInCookie(123);
        expect(JSON.stringify(allSystemStatus)).toBe('{"isInitialized":true,"isLogin":true,"isDeInit":false,"isRecover":false,"isReInit":false,"isRollingBack":false,"isSettingParam":false,"isClusterConfigExporting":false}');
    });

    it('Remove cookie', () => {
        // Remove them all.
        ckRemove('init');
        ckRemove('login');
        ckRemove('deinit');
        ckRemove('recover');
        ckRemove('reinit');
        ckRemove('rollbacking');
        ckRemove('setparam');
        ckRemove('clusterconfigexport');
    });
});