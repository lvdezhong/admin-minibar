import {
    GET_DEVICE_PENDING,
    GET_DEVICE_SUCCESS,
    GET_DEVICE_ERROR,
    GET_DEVICE_ITEM_PENDING,
    GET_DEVICE_ITEM_SUCCESS,
    GET_DEVICE_ITEM_ERROR,
    PUSH_DEVICE_DEFAULT_ITEM,
    PUSH_DEVICE_GOODS_ITEM
} from '../actions/device'

import {
    GET_ALL_MAINTPL_PENDING,
    GET_ALL_MAINTPL_SUCCESS,
    GET_ALL_MAINTPL_ERROR,
    GET_MAINTPL_GOODS_PENDING,
    GET_MAINTPL_GOODS_SUCCESS,
    GET_MAINTPL_GOODS_ERROR
} from '../actions/maintpl'

import { combineReducers } from 'redux'

const goodsList = (state = [], action) => {
    switch (action.type) {
        case PUSH_DEVICE_GOODS_ITEM:
            const { index, item } = action.payload;
            var cacheState = state.slice(0);
            cacheState.splice(index, 1, item);
            return cacheState;
        case PUSH_DEVICE_DEFAULT_ITEM:
            const { defaultItem, length } = action.payload;
            var cacheState = state.slice(0);
            let len = length - cacheState.length
            for (let i = 0; i < len; i++) {
                let cacheDefaultItem = Object.assign({}, defaultItem);
                cacheDefaultItem.sort_index = (i + state.length);
                cacheState.push(cacheDefaultItem);
            }
            return cacheState;
        case GET_MAINTPL_GOODS_SUCCESS:
            return action.payload.data.tmpl_item_list
        default:
            return state;
    }
}

const device = (state = [], action) => {
    switch (action.type) {
        case GET_DEVICE_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentDevice = (state = {}, action) => {
    switch (action.type) {
        case GET_DEVICE_ITEM_SUCCESS:
            return Object.assign({}, state, action.payload.data);
        case PUSH_DEVICE_DEFAULT_ITEM:
        case PUSH_DEVICE_GOODS_ITEM:
        case GET_MAINTPL_GOODS_SUCCESS:
            return Object.assign({}, state, {
                machine_item_list: goodsList(state.machine_item_list, action)
            });
        default:
            return state;
    }
}

const maintpl = (state = [], action) => {
    switch (action.type) {
        case GET_ALL_MAINTPL_SUCCESS:
            return action.payload.data.machine_tmpl_list
        default:
            return state;
    }
}

const isPending = (state = false, action) => {
    switch (action.type) {
        case GET_DEVICE_PENDING:
        case GET_DEVICE_ITEM_PENDING:
            return true;
        case GET_DEVICE_SUCCESS:
        case GET_DEVICE_ERROR:
        case GET_DEVICE_ITEM_SUCCESS:
        case GET_DEVICE_ITEM_ERROR:
        case GET_MAINTPL_GOODS_SUCCESS:
        case GET_MAINTPL_GOODS_ERROR:
            return false;
        default:
            return state;
    }
}

const errors = (state = null, action = {}) => {
    switch (action.type) {
        case GET_DEVICE_ERROR:
        case GET_DEVICE_ITEM_ERROR:
        case GET_MAINTPL_GOODS_ERROR:
            return action.payload.message;
        default:
            return state;
    }
}

const deviceReducer = combineReducers({
    device,
    currentDevice,
    isPending,
    maintpl,
    errors
});

export default deviceReducer;
