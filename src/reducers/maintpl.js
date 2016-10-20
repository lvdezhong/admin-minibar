import {
    GET_MAINTPL_PENDING,
    GET_MAINTPL_SUCCESS,
    GET_MAINTPL_ERROR,
    COPY_MAINTPL_PENDING,
    COPY_MAINTPL_SUCCESS,
    COPY_MAINTPL_ERROR,
    DELETE_MAINTPL_PENDING,
    DELETE_MAINTPL_SUCCESS,
    DELETE_MAINTPL_ERROR,
    SET_MAINTPL_PENDING,
    SET_MAINTPL_SUCCESS,
    SET_MAINTPL_ERROR,
    GET_MAINTPL_ITEM_PENDING,
    GET_MAINTPL_ITEM_SUCCESS,
    GET_MAINTPL_ITEM_ERROR,
    // ADD_MAINTPL_PENDING,
    // ADD_MAINTPL_SUCCESS,
    // ADD_MAINTPL_ERROR,
    // UPDATE_MAINTPL_PENDING,
    // UPDATE_MAINTPL_SUCCESS,
    // UPDATE_MAINTPL_ERROR,
    GET_NEW_MAINTPL,
    PUSH_MAINTPL_DEFAULT_ITEM,
    PUSH_MAINTPL_GOODS_ITEM
} from '../actions/maintpl'

import { combineReducers } from 'redux'

const goodsList = (state = [], action) => {
    switch (action.type) {
        case PUSH_MAINTPL_GOODS_ITEM:
            const { index, item } = action.payload;
            var cacheState = state.slice(0);
            cacheState.splice(index, 1, item);
            return cacheState;
        case PUSH_MAINTPL_DEFAULT_ITEM:
            const { defaultItem, length } = action.payload;
            var cacheState = state.slice(0);
            let len = length - cacheState.length
            for (let i = 0; i < len; i++) {
                let cacheDefaultItem = Object.assign({}, defaultItem);
                cacheDefaultItem.sort_index = (i + state.length);
                cacheState.push(cacheDefaultItem);
            }
            return cacheState;
        default:
            return state;
    }
}

const maintpl = (state = [], action) => {
    switch (action.type) {
        case GET_MAINTPL_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentMainTpl = (state = {}, action) => {
    switch (action.type) {
        case GET_MAINTPL_ITEM_SUCCESS:
            return Object.assign({}, state, action.payload.data);
        case PUSH_MAINTPL_DEFAULT_ITEM:
        case PUSH_MAINTPL_GOODS_ITEM:
            return Object.assign({}, state, {
                tmpl_item_list: goodsList(state.tmpl_item_list, action)
            });
        case GET_NEW_MAINTPL:
            return {
                tmpl_item_list: []
            }
        default:
            return state
    }
}

const isPending = (state = false, action) => {
    switch (action.type) {
        case GET_MAINTPL_PENDING:
        case COPY_MAINTPL_PENDING:
        case DELETE_MAINTPL_PENDING:
        case SET_MAINTPL_PENDING:
            return true;
        case GET_MAINTPL_SUCCESS:
        case GET_MAINTPL_ERROR:
        case COPY_MAINTPL_SUCCESS:
        case COPY_MAINTPL_ERROR:
        case DELETE_MAINTPL_SUCCESS:
        case DELETE_MAINTPL_ERROR:
        case SET_MAINTPL_SUCCESS:
        case SET_MAINTPL_ERROR:
        // case ADD_MAINTPL_SUCCESS:
        // case ADD_MAINTPL_ERROR:
        // case UPDATE_MAINTPL_SUCCESS:
        // case UPDATE_MAINTPL_ERROR:
            return false;
        default:
            return state;
    }
}

const errors = (state = null, action) => {
    switch (action.type) {
        case GET_MAINTPL_ERROR:
        case COPY_MAINTPL_ERROR:
        case DELETE_MAINTPL_ERROR:
        case SET_MAINTPL_ERROR:
        // case ADD_MAINTPL_ERROR:
        // case UPDATE_MAINTPL_ERROR:
            return action.payload.message;
        default:
            return state;
    }
}

const isUpdate = (state = false, action) => {
    switch (action.type) {
        case COPY_MAINTPL_SUCCESS:
        case DELETE_MAINTPL_SUCCESS:
        case SET_MAINTPL_SUCCESS:
        // case ADD_MAINTPL_SUCCESS:
        // case UPDATE_MAINTPL_SUCCESS:
            return true;
        default:
            return false;
    }
}

const maintplReducer = combineReducers({
    maintpl,
    currentMainTpl,
    isPending,
    errors,
    isUpdate
});

export default maintplReducer;
