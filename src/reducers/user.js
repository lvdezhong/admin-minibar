import {
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_SUCCESS,
    FETCH_PROFILE
} from '../actions/user'

import { combineReducers } from 'redux'

// export default function auth(state = initialState, action = {}) {
//     switch (action.type) {
//         case LOGIN_PENDING:
//             return Object.assign({}, initialState, {
//                 loggingIn: true
//             });
//         case LOGIN_SUCCESS:
//             return Object.assign({}, state, {
//                 user: action.payload.user,
//                 loggingIn: false,
//                 loginErrors: null
//             });
//         case LOGIN_ERROR:
//             return {
//                 ...state,
//                 loggingIn: false,
//                 user: null,
//                 loginErrors: action.payload.message
//             };
//         case LOGOUT_SUCCESS:
//             return {
//                 ...state,
//                 loggingOut: false,
//                 user: null,
//                 loginErrors: null
//             };
//         case FETCH_PROFILE_SUCCESS:
//             return Object.assign({}, state, {
//                 user: action.payload.user,
//                 loggingIn: false,
//                 loginErrors: null
//             });
//         default:
//             return state;
//     }
// }

const user = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return action.payload.data;
        case FETCH_PROFILE:
            return Object.assign({}, state, {
                user: action.payload
            });
        default:
            return state;
    }
}

const isPending = (state = false, action) => {
    switch (action.type) {
        case LOGIN_PENDING:
            return true;
        case LOGIN_SUCCESS:
        case LOGIN_ERROR:
            return false;
        default:
            return state;
    }
}

const errors = (state = null, action = {}) => {
    switch (action.type) {
        case LOGIN_ERROR:
            return action.payload;
        default:
            return state;
    }
}

const userReducer = combineReducers({
    user,
    isPending,
    errors
});

export default userReducer;
