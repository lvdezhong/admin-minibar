import types from './hotelType'
import { combineReducers } from 'redux'

const initialState = {
    hotel: {},
    currentHotel: 2,
    isPending: false,
    errors: null
}

const hotel = (state = initialState.hotel, action) => {
    switch (action.type) {
        case types.GET_HOTEL_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const currentHotel = (state = initialState.currentHotel, action) => {
    switch (action.type) {
        case types.SET_HOTEL:
            return action.payload.id;
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_HOTEL_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.GET_HOTEL_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const hotelReducer = combineReducers({
    hotel,
    currentHotel,
    isPending,
    errors
});

export default hotelReducer;
