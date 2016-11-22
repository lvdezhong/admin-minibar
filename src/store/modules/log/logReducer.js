import types from './logType'
import { combineReducers } from 'redux'

const log = (state = {}, action) => {
    switch (action.type) {
        case types.GET_LOG_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const logReducer = combineReducers({
    log
});

export default logReducer;
