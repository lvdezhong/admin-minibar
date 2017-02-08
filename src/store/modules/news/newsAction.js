import api from '../../../api'
import types from './newsType'

export const getNewsState = (params) => ({
    type: types.GET_NEWS_STATE,
    payload: api.get('/minibar/service/switch_status', params)
})

export const setNewsState = (params) => ({
    type: types.SET_NEWS_STATE,
    payload: api.post('/minibar/service/switch', params)
})

export const getNews = (params) => ({
    type: types.GET_NEWS,
    payload: api.get('/minibar/manager/news/list', params)
})

export const deleteNews = (params) => ({
    type: types.DELETE_NEWS,
    payload: api.post('/minibar/manager/news/delete', params)
})

export const addNews = (params) => ({
    type: types.ADD_NEWS,
    payload: api.post('/minibar/manager/news/add', params)
})

export const updateNews = (params) => ({
    type: types.UPDATE_NEWS,
    payload: api.post('/minibar/manager/news/update', params)
})

export const getCurrentNews = (params) => ({
    type: types.GET_NEWS_ITEM,
    payload: api.get('/minibar/manager/news/get', params)
})

export const getEmptyNews = () => ({
    type: types.GET_EMPTY_NEWS
})
