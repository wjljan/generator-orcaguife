import {stringify} from 'querystring';
import {checkFetchUnInterception, makeFetchOptions} from './fetchHelper';
import fetchInMainThread from './fetchInMainThread';
import FetchThreadPool from './FetchThreadPool';
import {validateIEOrEdgeBrowser} from 'Services';

const isIEOrEdgeBrowser = validateIEOrEdgeBrowser();
let fetchThreadPool = null;

const initRequest = (url, options) => {
    if (process.env.NODE_ENV === 'test'){
        return new Promise(async (resolve, reject) => {
            fetchInMainThread({url, options}, {resolve, reject});
        });
    } else {
        if (checkFetchUnInterception(url)){
            return new Promise(async (resolve, reject) => {
                makeFetchOptions(options);
                if (!isIEOrEdgeBrowser){
                    // Not IE/Edge series browsers, do fetch in worker threads.
                    if (!fetchThreadPool){
                        // Init fetchPool if not yet.
                        fetchThreadPool = new FetchThreadPool();
                    }
                    if (fetchThreadPool.haveIdleThread()){
                        fetchThreadPool.dispatchThread({url, options}, {resolve, reject});
                    } else {
                        // There is no idle thread, do fetch in main thread.
                        fetchInMainThread({url, options}, {resolve, reject});
                    }
                } else {
                    // Other browsers, do fetch in main thread.
                    fetchInMainThread({url, options}, {resolve, reject});
                }
            });
        }
    }
};

const initSearchUrl = (url, param) => (param ? url + '?' + stringify(param) : url);

export const fetchGet = (url, param) => (initRequest(initSearchUrl(url, param), {method: 'GET'}));

export const fetchPost = (url, param) => (initRequest(url, {credentials: 'same-origin', method: 'POST', body: JSON.stringify(param)}));

export const fetchMock = (data) => new Promise(resolve => setTimeout(() => resolve(data || true), 500));