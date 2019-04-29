import {redirectRouterAfterFetch} from "./fetchHelper";

export default async ({url, options}, {resolve, reject}) => {
    try {
        const response = await fetch(url, options);
        if (response.ok){
            let {code, data, msg} = await response.json();
            redirectRouterAfterFetch();
            code === 0 ? resolve(data) : reject({code, msg});
        } else {
            const {status, statusText} = response;
            reject({msg: statusText || `http error, code: ${status}`});
            console.info(`%c http error, code: ${status}`, 'color: #CC0033');
        }
    } catch (error){
        reject(error);
    }
};