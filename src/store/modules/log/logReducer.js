import types from './logType'
import { combineReducers } from 'redux'

const initialState = {
    log: {},
    isPending: false,
    errors: null
}

const log = (state = initialState.log, action) => {
    switch (action.type) {
        case types.GET_LOG_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_LOG_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.GET_LOG_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const logReducer = combineReducers({
    log,
    isPending,
    errors
});

export default logReducer;
