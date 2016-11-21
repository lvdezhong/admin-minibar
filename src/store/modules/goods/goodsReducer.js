import {
    GET_GOODS_PENDING,
    GET_GOODS_SUCCESS,
    GET_GOODS_ERROR,
    GET_GOODS_ITEM_PENDING,
    GET_GOODS_ITEM_SUCCESS,
    GET_GOODS_ITEM_ERROR,
    DELETE_GOODS_PENDING,
    DELETE_GOODS_SUCCESS,
    DELETE_GOODS_ERROR,
    GET_CATEGORY_PENDING,
    GET_CATEGORY_SUCCESS,
    GET_CATEGORY_ERROR,
    GET_NEW_GOODS
} from './goodsAction'

import { combineReducers } from 'redux'

const goods = (state = [], action) => {
    switch (action.type) {
        case GET_GOODS_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentGoods = (state = {}, action) => {
    switch (action.type) {
        case GET_GOODS_ITEM_SUCCESS:
            return action.payload.data.item;
        case GET_NEW_GOODS:
            return {}
        default:
            return state;
    }
}

const category = (state = {}, action) => {
    switch (action.type) {
        case GET_CATEGORY_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const isPending = (state = false, action) => {
    switch (action.type) {
        case GET_GOODS_PENDING:
        case GET_GOODS_ITEM_PENDING:
        case DELETE_GOODS_PENDING:
        case GET_CATEGORY_PENDING:
            return true;
        case GET_GOODS_SUCCESS:
        case GET_GOODS_ERROR:
        case GET_GOODS_ITEM_SUCCESS:
        case GET_GOODS_ITEM_ERROR:
        case DELETE_GOODS_SUCCESS:
        case DELETE_GOODS_ERROR:
        case GET_CATEGORY_SUCCESS:
        case GET_CATEGORY_ERROR:
            return false;
        default:
            return state;
    }
}

const errors = (state = null, action = {}) => {
    switch (action.type) {
        case GET_GOODS_ERROR:
        case GET_GOODS_ITEM_ERROR:
        case DELETE_GOODS_ERROR:
        case GET_CATEGORY_ERROR:
            return action.payload;
        default:
            return state;
    }
}

const isUpdate = (state = false, action) => {
    switch (action.type) {
        case DELETE_GOODS_SUCCESS:
            return true;
        default:
            return false;
    }
}

const goodsReducer = combineReducers({
    goods,
    currentGoods,
    category,
    isPending,
    errors,
    isUpdate
});

export default goodsReducer;
