import Cookie from 'js-cookie';

export const ckSet = Cookie.set;

export const ckGet = Cookie.get;

export const ckRemove = Cookie.remove;

const getKeyInCookie = key => JSON.parse(ckGet(key) || 'false');

const getAllSystemStatusInCookie = () => ({
    isInitialized: getKeyInCookie('init'),
});

/*
 * @Description: this is a specific function provided for getting system status in cookie only.
 *
 * @Usage examples:
 * params => result
 *
 * Get all status:
 * undefined|null|''|0|false => {isInitialized: true|false, isLogin: true|false, ...}
 *
 * Get a specific status:
 * 'init' => true|false
 *
 * Get some status indexed by an array:
 * ['init', 'isLogin', ...] => [true|false, true|false, ...]
 */

export const getSystemStatusInCookie = key => {
    if (!!key){
        if (typeof key === 'string'){
            return getKeyInCookie(key);
        } else if (Array.isArray(key)){
            return key.map(key => getKeyInCookie(key));
        } else {
            return getAllSystemStatusInCookie();
        }
    } else {
        return getAllSystemStatusInCookie();
    }
};