import {
    GET_ORDER_PENDING,
    GET_ORDER_SUCCESS,
    GET_ORDER_ERROR
} from '../actions/order'

import {
    GET_ALL_DEVICE_PENDING,
    GET_ALL_DEVICE_SUCCESS,
    GET_ALL_DEVICE_ERROR
} from '../actions/device'

import { combineReducers } from 'redux'

const order = (state = {}, action) => {
    switch (action.type) {
        case GET_ORDER_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const device = (state = [], action) => {
    switch (action.type) {
        case GET_ALL_DEVICE_SUCCESS:
            return action.payload.data.machine_list;
        default:
            return state;
    }
}

const isPending = (state = false, action) => {
    switch (action.type) {
        case GET_ORDER_PENDING:
            return true;
        case GET_ORDER_SUCCESS:
        case GET_ORDER_ERROR:
            return false;
        default:
            return state;
    }
}

const errors = (state = null, action = {}) => {
    switch (action.type) {
        case GET_ORDER_ERROR:
            return action.payload.message;
        default:
            return state;
    }
}

const orderReducer = combineReducers({
    order,
    isPending,
    device,
    errors
});

export default orderReducer;
