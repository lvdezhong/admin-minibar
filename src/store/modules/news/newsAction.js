import api from '../../../api'
import types from './newsType'

export const getNewsState = (params) => ({
    type: types.GET_NEWS_STATE,
    payload: api.post('/minibar/service/switch_status', params, true)
})

export const setNewsState = (params) => ({
    type: types.SET_NEWS_STATE,
    payload: api.post('/minibar/service/switch', params, true)
})

export const getNews = (params) => ({
    type: types.GET_NEWS,
    payload: api.post('/minibar/manager/news/list', params, true)
})

export const deleteNews = (params) => ({
    type: types.DELETE_NEWS,
    payload: api.post('/minibar/manager/news/delete', params)
})
