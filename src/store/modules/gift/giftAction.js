import api from '../../../api'
import types from './giftType'

import gift_list from '../../../mock/gift_list.json'
import gift_item from '../../../mock/gift_item.json'
import result from '../../../mock/result.json'

export const getGift = (params) => ({
    type: types.GET_GIFT,
    payload: api.post('/minibar/manager/item/gift_group/list', params)
})

export const deleteGift = (params) => ({
    type: types.DELETE_GIFT,
    payload: api.post('/minibar/manager/item/gift_group/delete', params)
})

export const getCurrentGift = (params) => ({
    type: types.GET_GIFT_ITEM,
    payload: api.get('/minibar/manager/item/gift_group/get', params)
})

export const updateGiftList = (data, key) => ({
    type: types.UPDATE_GIFT_LIST,
    payload: {
        data,
        key
    }
})

export const addGift = (params) => ({
    type: types.ADD_GIFT,
    payload: api.post('/minibar/manager/item/gift_group/add', params)
})

export const updateGift = (params) => ({
    type: types.UPDATE_GIFT,
    payload: api.post('/minibar/manager/item/gift_group/update', params)
})

export const getNewGift = () => ({
    type: types.GET_NEW_GIFT
})
