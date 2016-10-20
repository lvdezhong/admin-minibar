import api from '../api'

export const GET_DEVICE = 'GET_DEVICE';
export const GET_DEVICE_PENDING = 'GET_DEVICE_PENDING';
export const GET_DEVICE_SUCCESS = 'GET_DEVICE_SUCCESS';
export const GET_DEVICE_ERROR = 'GET_DEVICE_ERROR';

export const GET_DEVICE_ITEM = 'GET_DEVICE_ITEM';
export const GET_DEVICE_ITEM_PENDING = 'GET_DEVICE_ITEM_PENDING';
export const GET_DEVICE_ITEM_SUCCESS = 'GET_DEVICE_ITEM_SUCCESS';
export const GET_DEVICE_ITEM_ERROR = 'GET_DEVICE_ITEM_ERROR';

export const PUSH_DEVICE_DEFAULT_ITEM = 'PUSH_DEVICE_DEFAULT_ITEM';
export const PUSH_DEVICE_GOODS_ITEM = 'PUSH_DEVICE_GOODS_ITEM';

export const UPDATE_DEVICE = 'UPDATE_DEVICE';
export const UPDATE_DEVICE_PENDING = 'UPDATE_DEVICE_PENDING';
export const UPDATE_DEVICE_SUCCESS = 'UPDATE_DEVICE_SUCCESS';
export const UPDATE_DEVICE_ERROR = 'UPDATE_DEVICE_ERROR';

export const GET_ALL_DEVICE = 'GET_ALL_DEVICE';
export const GET_ALL_DEVICE_PENDING = 'GET_ALL_DEVICE_PENDING';
export const GET_ALL_DEVICE_SUCCESS = 'GET_ALL_DEVICE_SUCCESS';
export const GET_ALL_DEVICE_ERROR = 'GET_ALL_DEVICE_ERROR';

export const getDevice = (params) => ({
    type: GET_DEVICE,
    payload: {
        promise: api.post('/minibar/manager/machine/list', {
            params: params
        })
    }
})

export const getAllDevice = (params) => ({
    type: GET_ALL_DEVICE,
    payload: {
        promise: api.post('/minibar/manager/machine/list', {
            params: params
        })
    }
})

export const getCurrentDevice = (params) => ({
    type: GET_DEVICE_ITEM,
    payload: {
        promise: api.get('/minibar/manager/machine/get', {
            params: params
        })
    }
})

export const pushDeviceDefaultItem = (defaultItem, length) => ({
    type: PUSH_DEVICE_DEFAULT_ITEM,
    payload: {
        defaultItem,
        length
    }
})

export const pushDeviceGoodsItem = (index, item) => ({
    type: PUSH_DEVICE_GOODS_ITEM,
    payload: {
        index,
        item
    }
})

export const updateDevice = (params) => ({
    type: UPDATE_DEVICE,
    payload: {
        promise: api.post('/minibar/manager/machine/update', {
            params: params
        })
    }
})
