import types from './giftType'

import { combineReducers } from 'redux'

const giftList = (state = [], action) => {
    switch (action.type) {
        case types.UPDATE_GIFT_LIST:
            return action.data
        default:
            return state;
    }
}

const gift = (state = {}, action) => {
    switch (action.type) {
        case types.GET_GIFT_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentGift = (state = {}, action) => {
    switch (action.type) {
        case types.GET_GIFT_ITEM_SUCCESS:
            return action.payload.data.gift_group;
        case types.UPDATE_GIFT_LIST:
            return Object.assign({}, state, {
                [action.key]: giftList(state[action.key], action)
            });
        case types.GET_NEW_GIFT:
            return {}
        default:
            return state;
    }
}

const status = (state = null, action) => {
    switch (action.type) {
        case types.DELETE_GIFT_SUCCESS:
        case types.ADD_GIFT_SUCCESS:
        case types.UPDATE_GIFT_SUCCESS:
            return 'success';
        case types.DELETE_GIFT_ERROR:
        case types.GET_GIFT_ERROR:
        case types.ADD_GIFT_ERROR:
        case types.UPDATE_GIFT_ERROR:
            return 'fail';
        default:
            return null;
    }
}

const msg = (state = null, action) => {
    switch (action.type) {
        case types.DELETE_GIFT_SUCCESS:
            return '删除成功！';
        case types.ADD_GIFT_SUCCESS:
            return '添加成功！';
        case types.UPDATE_GIFT_SUCCESS:
            return '编辑成功！';
        case types.DELETE_GIFT_ERROR:
        case types.GET_GIFT_ERROR:
        case types.ADD_GIFT_ERROR:
        case types.UPDATE_GIFT_ERROR:
            return action.payload.msg
        default:
            return null;
    }
}

const giftReducer = combineReducers({
    gift,
    currentGift,
    status,
    msg
});

export default giftReducer;
