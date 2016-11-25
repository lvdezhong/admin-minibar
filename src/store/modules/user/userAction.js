import api from '../../../api';

export const UID_NOT_FOUND = 'UID_NOT_FOUND';

export const FETCH_PROFILE = 'FETCH_PROFILE';
// export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING';
// export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
// export const FETCH_PROFILE_ERROR = 'FETCH_PROFILE_ERROR';

export const LOGIN = 'LOGIN';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_PENDING = 'LOGOUT_PENDING';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export const fetchProfile = () => {
    let uid = localStorage.getItem('uid');
    let mobile = localStorage.getItem('mobile');

    if (uid === null) {
        return {
            type: UID_NOT_FOUND
        }
    }

    return {
        type: FETCH_PROFILE,
        payload: {
            uid,
            mobile
        }
    }
}

export const login = (params) => ({
    type: LOGIN,
    payload: api.post('/minibar/user/login', params)
})

export const logout = (params) => ({
    type: LOGOUT,
    payload: api.post('/minibar/user/logout')
})
