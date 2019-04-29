import {applyMiddleware, createStore} from 'redux';
import reducer from 'Reducers';
import thunk from './middleware/thunk';

export default createStore(reducer, applyMiddleware(thunk));