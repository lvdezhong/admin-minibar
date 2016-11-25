import api from '../../../api'
import types from './taskType'

export const getTask = (params) => ({
    type: types.GET_TASK,
    payload: api.get('/minibar/task/list', params)
})

export const invalidTask = (params) => ({
    type: types.INVALID_TASK,
    payload: api.post('/minibar/task/invalid', params)
})

export const getLoginUrl = () => ({
    type: types.GET_LOGIN_URL,
    payload: api.get('/minibar/wechat/thirdparty/componentloginurl')
})

export const getAuthorizeInfo = (params) => ({
    type: types.GET_AUTHORIZE_INFO,
    payload: api.get('/minibar/wechat/open/get', params)
})

export const getShareInfo = (data) => ({
    type: types.GET_SHARE_INFO,
    payload: {
        data
    }
})

export const setTaskType = (data) => ({
    type: types.SET_TASK_TYPE,
    payload: {
        data
    }
})

export const addTask = (params) => ({
    type: types.ADD_TASK,
    payload: api.post('/minibar/task/add', params)
})

export const updateTaskItemList = (data) => ({
    type: types.UPDATE_TASK_ITEM_LIST,
    payload: {
        data
    }
})

export const getCurrentTask = (params) => ({
    type: types.GET_TASK_ITEM,
    payload: api.get('/minibar/task/get', params)
})

export const updateTask = (params) => ({
    type: types.UPDATE_TASK,
    payload: api.post('/minibar/task/update', params)
})

export const getNewTask = (params) => ({
    type: types.GET_NEW_TASK
})
