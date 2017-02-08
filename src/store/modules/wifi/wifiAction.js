import api from '../../../api'
import types from './wifiType'

export const getWifi = (params) => ({
    type: types.GET_WIFI,
    payload: api.get('/minibar/wifi/config/list', params)
})

export const deleteWifi = (params) => ({
    type: types.DELETE_WIFI,
    payload: api.post('/minibar/wifi/config/delete', params)
})

export const getWifiState = (params) => ({
    type: types.GET_WIFI_STATE,
    payload: api.get('/minibar/service/switch_status', params)
})

export const setWifiState = (params) => ({
    type: types.SET_WIFI_STATE,
    payload: api.post('/minibar/service/switch', params)
})

export const getCurrentWifi = (data) => ({
    type: types.GET_WIFI_ITEM,
    payload: {
        data
    }
})

export const getRoom = (params) => ({
    type: types.GET_ROOM,
    payload: api.get('/minibar/wifi/config/room/list', params)
})

export const updateRoomList = (data, key) => ({
    type: types.UPDATE_ROOM_LIST,
    payload: {
        data,
        key
    }
})

export const addWifi = (params) => ({
    type: types.ADD_WIFI,
    payload: api.post('/minibar/wifi/config/add', params)
})

export const getNewWifi = () => ({
    type: types.GET_NEW_WIFI
})
