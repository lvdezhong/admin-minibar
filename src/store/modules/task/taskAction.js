import api from '../../../api'
import types from '../../types'

import task_list from '../../../mock/task_list.json'
import result from '../../../mock/result.json'
import login_url from '../../../mock/login_url.json'
import authorize_info from '../../../mock/authorize_info.json'
import task_item from '../../../mock/task_item.json'

export const getTask = (params) => ({
    type: types.GET_TASK,
    payload: {
        promise: api.post(task_list, {
            params: params
        }, true)
    }
})

export const invalidTask = (params) => ({
    type: types.INVALID_TASK,
    payload: {
        promise: api.post(result, {
            params: params
        }, true)
    }
})

export const getLoginUrl = () => ({
    type: types.GET_LOGIN_URL,
    payload: {
        promise: api.post(login_url, {}, true)
    }
})

export const getAuthorizeInfo = (params) => ({
    type: types.GET_AUTHORIZE_INFO,
    payload: {
        promise: api.post(authorize_info, {
            params: params
        }, true)
    }
})

export const getShareInfo = (data) => ({
    type: types.GET_SHARE_INFO,
    payload: {
        data
    }
})

export const setTaskType = (type) => ({
    type: types.SET_TASK_TYPE,
    payload: {
        type
    }
})

export const addTask = (params) => ({
    type: types.ADD_TASK,
    payload: {
        promise: api.post(result, {
            params: params
        }, true)
    }
})

export const updateTaskItemList = (data, key) => ({
    type: types.UPDATE_TASK_ITEM_LIST,
    payload: {
        data: data,
        key: key
    }
})

export const getCurrentTask = (params) => ({
    type: types.GET_TASK_ITEM,
    payload: {
        promise: api.post(task_item, {
            params: params
        }, true)
    }
})

export const updateTask = (params) => ({
    type: types.UPDATE_TASK,
    payload: {
        promise: api.post('/minibar/task/update', {
            params: params
        })
    }
})
