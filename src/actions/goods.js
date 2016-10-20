import api from '../api'

export const GET_GOODS = 'GET_GOODS';
export const GET_GOODS_PENDING = 'GET_GOODS_PENDING';
export const GET_GOODS_SUCCESS = 'GET_GOODS_SUCCESS';
export const GET_GOODS_ERROR = 'GET_GOODS_ERROR';

export const DELETE_GOODS = 'DELETE_GOODS';
export const DELETE_GOODS_PENDING = 'DELETE_GOODS_PENDING';
export const DELETE_GOODS_SUCCESS = 'DELETE_GOODS_SUCCESS';
export const DELETE_GOODS_ERROR = 'DELETE_GOODS_ERROR';

export const GET_GOODS_ITEM = 'GET_GOODS_ITEM';
export const GET_GOODS_ITEM_PENDING = 'GET_GOODS_ITEM_PENDING';
export const GET_GOODS_ITEM_SUCCESS = 'GET_GOODS_ITEM_SUCCESS';
export const GET_GOODS_ITEM_ERROR = 'GET_GOODS_ITEM_ERROR';

export const GET_CATEGORY = 'GET_CATEGORY';
export const GET_CATEGORY_PENDING = 'GET_CATEGORY_PENDING';
export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS';
export const GET_CATEGORY_ERROR = 'GET_CATEGORY_ERROR';

export const ADD_GOODS = 'ADD_GOODS';
// export const ADD_GOODS_PENDING = 'ADD_GOODS_PENDING';
// export const ADD_GOODS_SUCCESS = 'ADD_GOODS_SUCCESS';
// export const ADD_GOODS_ERROR = 'ADD_GOODS_ERROR';

export const UPDATE_GOODS = 'UPDATE_GOODS';
// export const UPDATE_GOODS_PENDING = 'UPDATE_GOODS_PENDING';
// export const UPDATE_GOODS_SUCCESS = 'UPDATE_GOODS_SUCCESS';
// export const UPDATE_GOODS_ERROR = 'UPDATE_GOODS_ERROR';

export const GET_NEW_GOODS = 'GET_NEW_GOODS';

export const getGoods = (params) => ({
    type: GET_GOODS,
    payload: {
        promise: api.post('/minibar/manager/item/list', {
            params: params
        })
    }
})

export const deleteGoods = (params) => ({
    type: DELETE_GOODS,
    payload: {
        promise: api.post('/minibar/manager/item/delete', {
            params: params
        })
    }
})

export const getCurrentGoods = (params) => ({
    type: GET_GOODS_ITEM,
    payload: {
        promise: api.get('/minibar/manager/item/get', {
            params: params
        })
    }
})

export const getNewGoods = () => ({
    type: GET_NEW_GOODS
})

export const getCategory = (params) => ({
    type: GET_CATEGORY,
    payload: {
        promise: api.post('/minibar/manager/item/category/list', {
            params: params
        })
    }
})

export const addGoods = (params) => ({
    type: ADD_GOODS,
    payload: {
        promise: api.post('/minibar/manager/item/add', {
            params: params
        })
    }
})

export const updateGoods = (params) => ({
    type: UPDATE_GOODS,
    payload: {
        promise: api.post('/minibar/manager/item/update', {
            params: params
        })
    }
})
