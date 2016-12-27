import api from '../../../api'
import types from './contactType'

export const getContactState = (params) => ({
    type: types.GET_CONTACT_STATE,
    payload: api.post('/minibar/service/switch_status', params, true)
})

export const setContactState = (params) => ({
    type: types.SET_CONTACT_STATE,
    payload: api.post('/minibar/service/switch', params, true)
})

export const getMobile = (params) => ({
    type: types.GET_MOBILE,
    payload: api.get('/minibar/front/mobile/get', params, true)
})

export const updateMobile = (params) => ({
    type: types.UPDATE_MOBILE,
    payload: api.post('/minibar/front/mobile/update', params)
})
