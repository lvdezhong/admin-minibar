import api from '../../../api'
import types from './hotelType'

export const getHotel = (params) => ({
    type: types.GET_HOTEL,
    payload: api.get('/minibar/hotel/list', params)
})

export const setHotel = (id) => ({
    type: types.SET_HOTEL,
    payload: {
        id
    }
})
