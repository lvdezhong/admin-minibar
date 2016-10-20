import api from '../api'

export const GET_MAINTPL = 'GET_MAINTPL';
export const GET_MAINTPL_PENDING = 'GET_MAINTPL_PENDING';
export const GET_MAINTPL_SUCCESS = 'GET_MAINTPL_SUCCESS';
export const GET_MAINTPL_ERROR = 'GET_MAINTPL_ERROR';

export const GET_ALL_MAINTPL = 'GET_ALL_MAINTPL';
export const GET_ALL_MAINTPL_PENDING = 'GET_ALL_MAINTPL_PENDING';
export const GET_ALL_MAINTPL_SUCCESS = 'GET_ALL_MAINTPL_SUCCESS';
export const GET_ALL_MAINTPL_ERROR = 'GET_ALL_MAINTPL_ERROR';

export const COPY_MAINTPL = 'COPY_MAINTPL';
export const COPY_MAINTPL_PENDING = 'COPY_MAINTPL_PENDING';
export const COPY_MAINTPL_SUCCESS = 'COPY_MAINTPL_SUCCESS';
export const COPY_MAINTPL_ERROR = 'COPY_MAINTPL_ERROR';

export const DELETE_MAINTPL = 'DELETE_MAINTPL';
export const DELETE_MAINTPL_PENDING = 'DELETE_MAINTPL_PENDING';
export const DELETE_MAINTPL_SUCCESS = 'DELETE_MAINTPL_SUCCESS';
export const DELETE_MAINTPL_ERROR = 'DELETE_MAINTPL_ERROR';

export const SET_MAINTPL = 'SET_MAINTPL';
export const SET_MAINTPL_PENDING = 'SET_MAINTPL_PENDING';
export const SET_MAINTPL_SUCCESS = 'SET_MAINTPL_SUCCESS';
export const SET_MAINTPL_ERROR = 'SET_MAINTPL_ERROR';

export const GET_MAINTPL_ITEM = 'GET_MAINTPL_ITEM';
export const GET_MAINTPL_ITEM_PENDING = 'GET_MAINTPL_ITEM_PENDING';
export const GET_MAINTPL_ITEM_SUCCESS = 'GET_MAINTPL_ITEM_SUCCESS';
export const GET_MAINTPL_ITEM_ERROR = 'GET_MAINTPL_ITEM_ERROR';

export const GET_MAINTPL_GOODS = 'GET_MAINTPL_GOODS';
export const GET_MAINTPL_GOODS_PENDING = 'GET_MAINTPL_GOODS_PENDING';
export const GET_MAINTPL_GOODS_SUCCESS = 'GET_MAINTPL_GOODS_SUCCESS';
export const GET_MAINTPL_GOODS_ERROR = 'GET_MAINTPL_GOODS_ERROR';

export const ADD_MAINTPL = 'ADD_MAINTPL';
// export const ADD_MAINTPL_PENDING = 'ADD_MAINTPL_PENDING';
// export const ADD_MAINTPL_SUCCESS = 'ADD_MAINTPL_SUCCESS';
// export const ADD_MAINTPL_ERROR = 'ADD_MAINTPL_ERROR';

export const UPDATE_MAINTPL = 'UPDATE_MAINTPL';
// export const UPDATE_MAINTPL_PENDING = 'UPDATE_MAINTPL_PENDING';
// export const UPDATE_MAINTPL_SUCCESS = 'UPDATE_MAINTPL_SUCCESS';
// export const UPDATE_MAINTPL_ERROR = 'UPDATE_MAINTPL_ERROR';

export const GET_NEW_MAINTPL = 'GET_NEW_MAINTPL';

export const PUSH_MAINTPL_DEFAULT_ITEM = 'PUSH_MAINTPL_DEFAULT_ITEM';
export const PUSH_MAINTPL_GOODS_ITEM = 'PUSH_MAINTPL_GOODS_ITEM';

export const getMainTpl = (params) => ({
    type: GET_MAINTPL,
    payload: {
        promise: api.post('/minibar/manager/machine_tmpl/list', {
            params: params
        })
    }
})

export const getAllMainTpl = (params) => ({
    type: GET_ALL_MAINTPL,
    payload: {
        promise: api.post('/minibar/manager/machine_tmpl/list', {
            params: params
        })
    }
})

export const copyMainTpl = (params) => ({
    type: COPY_MAINTPL,
    payload: {
        promise: api.get('/minibar/manager/machine_tmpl/copy', {
            params: params
        })
    }
})

export const deleteMainTpl = (params) => ({
    type: DELETE_MAINTPL,
    payload: {
        promise: api.post('/minibar/manager/machine_tmpl/delete', {
            params: params
        })
    }
})

export const setMainTpl = (params) => ({
    type: SET_MAINTPL,
    payload: {
        promise: api.get('/minibar/manager/machine_tmpl/default_set', {
            params: params
        })
    }
})

export const getCurrentMainTpl = (params) => ({
    type: GET_MAINTPL_ITEM,
    payload: {
        promise: api.get('/minibar/manager/machine_tmpl/get', {
            params: params
        })
    }
})

export const getCurrentMainTplGoods = (params) => ({
    type: GET_MAINTPL_GOODS,
    payload: {
        promise: api.get('/minibar/manager/machine_tmpl/get', {
            params: params
        })
    }
})

export const addMainTpl = (params) => ({
    type: ADD_MAINTPL,
    payload: {
        promise: api.post('/minibar/manager/machine_tmpl/add', {
            params: params
        })
    }
})

export const updateMainTpl = (params) => ({
    type: UPDATE_MAINTPL,
    payload: {
        promise: api.post('/minibar/manager/machine_tmpl/update', {
            params: params
        })
    }
})

export const getNewMainTpl = () => ({
    type: GET_NEW_MAINTPL
})

export const pushMainTplDefaultItem = (defaultItem, length) => ({
    type: PUSH_MAINTPL_DEFAULT_ITEM,
    payload: {
        defaultItem,
        length
    }
})

export const pushMainTplGoodsItem = (index, item) => ({
    type: PUSH_MAINTPL_GOODS_ITEM,
    payload: {
        index,
        item
    }
})
