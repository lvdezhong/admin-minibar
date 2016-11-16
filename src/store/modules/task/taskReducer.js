import types from '../../types'

import { combineReducers } from 'redux'

const itemList = (state = [], action) => {
    switch (action.type) {
        case types.UPDATE_TASK_ITEM_LIST:
            return action.payload.data
        case types.GET_AUTHORIZE_INFO_SUCCESS:
        case types.GET_SHARE_INFO:
            return [];
        default:
            return state;
    }
}

const task = (state = {}, action) => {
    switch (action.type) {
        case types.GET_TASK_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentTask = (state = {}, action) => {
    switch (action.type) {
        case types.GET_TASK_ITEM_SUCCESS:
            return action.payload.data;
        case types.UPDATE_TASK_ITEM_LIST:
        case types.GET_AUTHORIZE_INFO_SUCCESS:
        case types.GET_SHARE_INFO:
            return Object.assign({}, state, {
                task_item_list: itemList(state[action.payload.key], action)
            });
        case types.GET_NEW_GOODS:
            return {}
        default:
            return state;
    }
}

const type = (state = '2', action) => {
    switch (action.type) {
        case types.SET_TASK_TYPE:
            return action.payload.type;
        case types.GET_TASK_ITEM_SUCCESS:
            return action.payload.data.type;
        default:
            return state;
    }
}

const loginUrl = (state = null, action) => {
    switch (action.type) {
        case types.GET_LOGIN_URL_SUCCESS:
            return action.payload.data.login_url;
        default:
            return null;
    }
}

const authorizeInfo = (state = null, action) => {
    switch (action.type) {
        case types.GET_AUTHORIZE_INFO_SUCCESS:
            return action.payload.data;
        case types.GET_TASK_ITEM_SUCCESS:
            return {
                nick_name: action.payload.data.wechat_open_d_t_o && action.payload.data.wechat_open_d_t_o.nick_name,
                id: action.payload.data.wechat_open_d_t_o && action.payload.data.wechat_open_d_t_o.id
            }
        default:
            return state;
    }
}

const shareInfo = (state = null, action) => {
    switch (action.type) {
        case types.GET_SHARE_INFO:
            return action.payload.data;
        case types.GET_TASK_ITEM_SUCCESS:
            return {
                count: action.payload.data.count,
                share_url: action.payload.data.share_url
            }
        default:
            return state;
    }
}

const status = (state = null, action) => {
    switch (action.type) {
        case types.INVALID_TASK_SUCCESS:
        case types.ADD_TASK_SUCCESS:
        case types.UPDATE_TASK_SUCCESS:
            return 'success';
        case types.GET_TASK_ERROR:
        case types.INVALID_TASK_ERROR:
        case types.GET_LOGIN_URL_ERROR:
        case types.GET_AUTHORIZE_INFO_ERROR:
        case types.ADD_TASK_ERROR:
        case types.UPDATE_TASK_ERROR:
            return 'fail';
        default:
            return null;
    }
}

const msg = (state = null, action) => {
    switch (action.type) {
        case types.INVALID_TASK_SUCCESS:
            return '已失效！'
        case types.ADD_TASK_SUCCESS:
            return '添加成功！'
        case types.UPDATE_TASK_SUCCESS:
            return '更新成功！'
        case types.GET_TASK_ERROR:
        case types.INVALID_TASK_ERROR:
        case types.GET_LOGIN_URL_ERROR:
        case types.GET_AUTHORIZE_INFO_ERROR:
        case types.ADD_TASK_ERROR:
        case types.UPDATE_TASK_ERROR:
            return action.payload.msg
        default:
            return null;
    }
}

const taskReducer = combineReducers({
    task,
    currentTask,
    type,
    loginUrl,
    authorizeInfo,
    shareInfo,
    status,
    msg
});

export default taskReducer;
