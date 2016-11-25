import api from '../../../api'

export const GET_ALL_MENU = 'GET_ALL_MENU';
export const UPDATE_NAVPATH = 'UPDATE_NAVPATH';

export const updateNavPath = (path, key) => ({
    type: UPDATE_NAVPATH,
    payload: {
        path,
        key
    }
})

export const getAllMenu = () => ({
    type: GET_ALL_MENU
})
