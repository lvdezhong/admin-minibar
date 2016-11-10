import {
    GET_CHART_PENDING,
    GET_CHART_SUCCESS,
    GET_CHART_ERROR,
    GET_HOTEL_PENDING,
    GET_HOTEL_SUCCESS,
    GET_HOTEL_ERROR
} from './chartAction'


import { combineReducers } from 'redux'

const chart = (state = {}, action) => {
    switch (action.type) {
        case GET_CHART_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const hotel = (state = [], action) => {
    switch (action.type) {
        case GET_HOTEL_SUCCESS:
            return action.payload.data.hotel_list;
        default:
            return state;
    }
}

const isPending = (state = false, action) => {
    switch (action.type) {
        case GET_CHART_PENDING:
        case GET_HOTEL_PENDING:
            return true;
        case GET_CHART_SUCCESS:
        case GET_CHART_ERROR:
        case GET_HOTEL_SUCCESS:
        case GET_HOTEL_ERROR:
            return false;
        default:
            return state;
    }
}

const errors = (state = null, action = {}) => {
    switch (action.type) {
        case GET_CHART_ERROR:
        case GET_HOTEL_ERROR:
            return action.payload.message;
        default:
            return state;
    }
}

const orderReducer = combineReducers({
    chart,
    isPending,
    hotel,
    errors
});

export default orderReducer;
