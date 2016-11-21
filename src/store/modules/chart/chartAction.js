import api from '../../../api'

export const GET_CHART = 'GET_CHART';
export const GET_CHART_PENDING = 'GET_CHART_PENDING';
export const GET_CHART_SUCCESS = 'GET_CHART_SUCCESS';
export const GET_CHART_ERROR = 'GET_CHART_ERROR';
export const GET_HOTEL = 'GET_HOTEL';
export const GET_HOTEL_PENDING = 'GET_HOTEL_PENDING';
export const GET_HOTEL_SUCCESS = 'GET_HOTEL_SUCCESS';
export const GET_HOTEL_ERROR = 'GET_HOTEL_ERROR';

export const getChart = (params) => ({
    type: GET_CHART,
    payload: api.get('/minibar/task/data/list', {
        params: params
    })
});

export const getHotel = (params) => ({
    type: GET_HOTEL,
    payload: api.post('/minibar/machine/hotel/list', {
        params: params
    })
})
