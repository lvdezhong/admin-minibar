import types from './serviceType'
import { combineReducers } from 'redux'

const initialState = {
    service: {},
    order: {},
    isPending: false,
    errors: null
}

const service = (state = initialState.service, action) => {
    switch (action.type) {
        case types.GET_SERVICE_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentService = (state = {}, action) => {
    switch (action.type) {
        case types.GET_SERVICE_ITEM_SUCCESS:
            return action.payload.data;
        case types.GET_NEW_SERVICE:
            return {}
        default:
            return state;
    }
}

const order = (state = initialState.order, action) => {
    switch (action.type) {
        case types.GET_SERVICE_ORDER_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_SERVICE_PENDING:
        case types.DELETE_SERVICE_PENDING:
        case types.CONFIRM_ORDER_PENDING:
        case types.ADD_SERVICE_PENDING:
        case types.UPDATE_SERVICE_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.GET_SERVICE_ERROR:
        case types.DELETE_SERVICE_ERROR:
        case types.CONFIRM_ORDER_ERROR:
        case types.ADD_SERVICE_ERROR:
        case types.UPDATE_SERVICE_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const serviceReducer = combineReducers({
    service,
    currentService,
    order,
    isPending,
    errors
});

export default serviceReducer;
