import {getSystemStatusInCookie} from 'Services';
import routerPath from 'RouterPath';

const alwaysAllowURLs = ['/api/syncsystemstatus'];

export const checkFetchUnInterception = url => {
    // In order to intercept fetch requests, firstly pause the playbook of cronJob,
    // and do a double check here.
    // If system is de-initializing or rolling back, all HTTP requests shouldn't be sent,
    // only except the alwaysAllowURLs, they can go through properly.
    const [
        isDeInit,
        isRecovering,
        isRollingBack,
        isSettingParameter,
        isClusterConfigExporting
    ] = getSystemStatusInCookie([
        'deinit',
        'recover',
        'rollbacking',
        'setparam',
        'clusterconfigexport'
    ]);
    return alwaysAllowURLs.includes(url) ||
    (
        !isDeInit &&
        !isRecovering &&
        !isRollingBack &&
        !isSettingParameter &&
        !isClusterConfigExporting
    );
};

export const makeFetchOptions = (options) => {
    options.credentials = 'same-origin';
    options.withCredentials = true;
    options.headers = {'Content-Type': 'application/json; charset=utf-8'};
};

export const redirectRouterAfterFetch = () => {
    if (!window.location.hash.match(routerPath.Init)){
        const [isInitialized, isLoggedIn] = getSystemStatusInCookie(['init', 'login']);
        // If not on initialize page, need to verify system status.
        if (!isInitialized){
            window.location.hash = routerPath.Init;
        } else {
            if (!isLoggedIn){
                window.location.hash = routerPath.Login;
            }
        }
    }
};