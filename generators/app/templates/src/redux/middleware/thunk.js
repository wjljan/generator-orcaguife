// thunk
function createThunkMiddleware (extraArgument){
    // Inject {dispatch, getState} object, like a simplest store.
    return function ({dispatch, getState}){
        // Inject reformed dispatch function form previous middleware which is called next here,
        // and if this middleware is called firstly in the compose chain, the next here is the
        // raw store.dispatch.
        return function (next){
            // console.log('thunk', next.toString());

            // Wrap the previous dispatch function inject by previous middleware and the logic code
            // of this middleware, and return the reformed dispatch function gave by this middleware.
            // This returned reformed dispatch function will be injected into next middleware by compose.
            return function (action){
                // Self codes.
                if (typeof action === 'function'){
                    return action(dispatch, getState, extraArgument);
                }
                // Call next dispatch.
                return next(action);
            };
        }
    }
}

let thunk = createThunkMiddleware();    // If there is no extraArgument pass in, just call it inside of source code.
thunk.withExtraArgument = createThunkMiddleware;  // If needs to pass in an extraArgument, call it when using, see below:

export default thunk;

/*
// The withExtraArgument needs the version be upper than 2.1.0, and will be used like this:
const store = createStore(reducer, applyMiddleware(thunk.withExtraArgument({api, whatever})))

// A usage example is like below:

// Action
const getUserInfo = (id) => {
    return function (dispatch, getState, extraArgument){
        return reqGet({id: id})
        .then(res => res.json().data)
        .then(info => {
            dispatch({
                type: "GET_USER_INFO",
                info
            })
        })
        .catch(err => console.log('reqGet error: ' + err));
    }
};

// Component code
dispatch(getUserInfo(1));

// To handle more complex async functions we can try redux-saga which is based on ES6 generator.
*/