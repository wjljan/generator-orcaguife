import State from '../state';
import {testActionTypes} from 'Actions/testAction';

const testReducer = (state = State.test, action) => {
    let {a, b} = action;
    switch (action.type){
        // set a
        case testActionTypes.SET_A:
            return Object.assign({}, state, a);

        // set b
        case testActionTypes.SET_B:
            return Object.assign({}, state, b);

        default:
            return state;
    }
};

export default testReducer;