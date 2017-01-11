import api from '../../../api'
import types from './serviceType'

export const getService = (params) => ({
    type: types.GET_SERVICE,
    payload: api.get('/minibar/manager/service/list', params)
})

export const deleteService = (params) => ({
    type: types.DELETE_SERVICE,
    payload: api.post('/minibar/manager/service/delete', params)
})

export const getServiceOrder = (params) => ({
    type: types.GET_SERVICE_ORDER,
    payload: api.get('/minibar/manager/service_appointment/list', params)
})

export const orderConfirm = (params) => ({
    type: types.CONFIRM_ORDER,
    payload: api.post('/minibar/manager/service/confirm/use', params)
})

export const addService = (params) => ({
    type: types.ADD_SERVICE,
    payload: api.post('/minibar/manager/service/add', params)
})

export const getCurrentService = (params) => ({
    type: types.GET_SERVICE_ITEM,
    payload: api.get('/minibar/manager/service/get', params)
})

export const updateService = (params) => ({
    type: types.UPDATE_SERVICE,
    payload: api.post('/minibar/manager/service/update', params)
})

export const getNewService = () => ({
    type: types.GET_NEW_SERVICE
})
