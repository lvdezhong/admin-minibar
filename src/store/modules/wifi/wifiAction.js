import api from '../../../api'
import types from './wifiType'

export const getWifi = (params) => ({
    type: types.GET_WIFI,
    payload: api.post('/minibar/wifi/config/list', params, true)
})

export const deleteWifi = (params) => ({
    type: types.DELETE_WIFI,
    payload: api.post('/minibar/wifi/config/delete', params)
})

export const getWifiState = (params) => ({
    type: types.GET_WIFI_STATE,
    payload: api.post('/minibar/service/switch_status', params, true)
})

export const setWifiState = (params) => ({
    type: types.SET_WIFI_STATE,
    payload: api.post('/minibar/service/switch', params, true)
})

export const getCurrentWifi = (data) => ({
    type: types.GET_WIFI_ITEM,
    payload: {
        data
    }
})

export const getRoom = (params) => ({
    type: types.GET_ROOM,
    payload: api.post('/minibar/wifi/config/room/list', params, true)
})

export const updateRoomList = (data, key) => ({
    type: types.UPDATE_ROOM_LIST,
    payload: {
        data,
        key
    }
})

export const getNewWifi = () => ({
    type: types.GET_NEW_WIFI
})
