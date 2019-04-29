import {fetchGet, fetchPost} from './fetch';
import {lsGet, catchAPIError, dispatchAction} from 'Services';
import store from '../redux';
import testAction from 'Actions/testAction';


/*
 * Optimizations in future:
 * We send async HTTP API calls here, and after a call is finished, we make a sync action
 * through the action creator. In this way, we don't need to fire a action in an async handle
 * process. However, in official documents, it tells us we should write an async HTTP API call
 * into an action. This is determined depends on a redux idea that each part in APP has its
 * own responsibility, render the view, calculate the state, or others. For the HTTP API calls,
 * they are used to get the data(state), so they should be encapsulated into a action. But
 * as we know, the dispatch only receive an action object, we can't give it a HTTP API async
 * function. So, wanna reach this goal, we should use a middleware named redux-thunk which can
 * let use dispatch a async function. Should rebuild all the HTTP API calls at some time of future.
 */

/*
 * We use catchAPIError decorator to catch the API caller error.
 * And the dispatchAction decorator to simplify the data handle process:
 * if we don't need to dispatch a action in a API caller any more, just need
 * to remove the decorator, it's a convenient way.
 *
 * And for all the CUD operations related API callers, server side will response
 * us the left data when the call is finished and ok, so we don't need to raise
 * another API caller to fetch these data again.
 */

export default {
    // example codes:

    @dispatchAction([
        [testAction, 'setA', 'A'],
        [testAction, 'setB', 'B'],
    ])
    @catchAPIError
    async getAllValues (){
        return await fetchPost('/api/test');
    },

    @dispatchAction(testAction, 'setA')
    @catchAPIError
    async getValue (){
        return await fetchGet('/api/test');
    },
};