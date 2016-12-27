import api from '../../../api'
import types from './hotelType'

export const getHotel = (params) => ({
    type: types.GET_HOTEL,
    payload: api.post('/minibar/hotel/list', params, true)
})

export const setHotel = (id) => ({
    type: types.SET_HOTEL,
    payload: {
        id
    }
})
