import types from './contactType'
import { combineReducers } from 'redux'

const initialState = {
    contactState: 0,
    mobile: '',
    isPending: false,
    errors: null
}

const contactState = (state = initialState.contactState, action) => {
    switch (action.type) {
        case types.GET_CONTACT_STATE_SUCCESS:
            return action.payload.data.status
        case types.SET_CONTACT_STATE_SUCCESS:
            return state == 0 ? 1 : 0;
        default:
            return state;
    }
}

const mobile = (state = initialState.mobile, action) => {
    switch (action.type) {
        case types.GET_MOBILE_SUCCESS:
            return action.payload.data.mobile
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_CONTACT_STATE_PENDING:
        case types.SET_CONTACT_STATE_PENDING:
        case types.GET_MOBILE_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.GET_CONTACT_STATE_ERROR:
        case types.SET_CONTACT_STATE_ERROR:
        case types.GET_MOBILE_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const contactReducer = combineReducers({
    contactState,
    mobile,
    isPending,
    errors
});

export default contactReducer;
