import types from './wifiType'
import { combineReducers } from 'redux'

const initialState = {
    wifi: {},
    currentWifi: {},
    wifiState: 0,
    room: {},
    isPending: false,
    errors: null
}

const roomList = (state = [], action) => {
    switch (action.type) {
        case types.UPDATE_ROOM_LIST:
            return action.payload.data
        default:
            return state;
    }
}

const wifi = (state = initialState.wifi, action) => {
    switch (action.type) {
        case types.GET_WIFI_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentWifi = (state = initialState.currentWifi, action) => {
    switch (action.type) {
        case types.GET_WIFI_ITEM:
            return action.payload.data;
        case types.UPDATE_ROOM_LIST:
            return Object.assign({}, state, {
                [action.payload.key]: roomList(state[action.payload.key], action)
            });
        case types.GET_NEW_WIFI:
            return {}
        default:
            return state;
    }
}

const wifiState = (state = initialState.wifiState, action) => {
    switch (action.type) {
        case types.GET_WIFI_STATE_SUCCESS:
            return action.payload.data.status
        case types.SET_WIFI_STATE_SUCCESS:
            return state == 0 ? 1 : 0;
        default:
            return state;
    }
}

const room = (state = initialState.room, action) => {
    switch (action.type) {
        case types.GET_ROOM_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_WIFI_PENDING:
        case types.DELETE_WIFI_PENDING:
        case types.GET_WIFI_STATE_PENDING:
        case types.SET_WIFI_STATE_PENDING:
        case types.GET_ROOM_PENDING:
        case types.ADD_WIFI_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.GET_WIFI_ERROR:
        case types.DELETE_WIFI_ERROR:
        case types.GET_WIFI_STATE_ERROR:
        case types.SET_WIFI_STATE_ERROR:
        case types.GET_ROOM_ERROR:
        case types.ADD_WIFI_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const wifiReducer = combineReducers({
    wifi,
    currentWifi,
    wifiState,
    room,
    isPending,
    errors
});

export default wifiReducer;
