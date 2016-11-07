import api from '../../../api'
import types from '../../types'

import gift_list from '../../../mock/gift_list.json'
import gift_item from '../../../mock/gift_item.json'
import result from '../../../mock/result.json'

export const getGift = (params) => ({
    type: types.GET_GIFT,
    payload: {
        promise: api.post('/minibar/manager/item/gift_group/list', {
            params: params
        })
    }
})

export const deleteGift = (params) => ({
    type: types.DELETE_GIFT,
    payload: {
        promise: api.post('/minibar/manager/item/gift_group/delete', {
            params: params
        })
    }
})

export const getCurrentGift = (params) => ({
    type: types.GET_GIFT_ITEM,
    payload: {
        promise: api.get('/minibar/manager/item/gift_group/get', {
            params: params
        })
    }
})

export const updateGiftList = (data, key) => ({
    type: types.UPDATE_GIFT_LIST,
    payload: {
        data: data,
        key: key
    }
})

export const addGift = (params) => ({
    type: types.ADD_GIFT,
    payload: {
        promise: api.post('/minibar/manager/item/gift_list/list', {
            params: params
        })
    }
})

export const updateGift = (params) => ({
    type: types.UPDATE_GIFT,
    payload: {
        promise: api.post('/minibar/manager/item/gift_group/update', {
            params: params
        })
    }
})
