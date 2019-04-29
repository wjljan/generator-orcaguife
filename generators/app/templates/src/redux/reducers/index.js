import {combineReducers} from 'redux';
import State from '../state';
import {lsGet} from 'Services';
import testReducer from './testReducer';

// export a combined reducer
export default combineReducers({
    // Here we use the ES6 default parameter syntax to handle the non-existent of
    // the state at the initial call of each top-level reducer. So, we don't
    // need to do it inside of each sub-reducer again.

    // example code:
    test: (test = State.test, action) => {
        return testReducer(test, action);
    },
});