import types from './newsType'
import { combineReducers } from 'redux'

const initialState = {
    newsState: 0,
    news: {},
    isPending: false,
    errors: null
}

const newsState = (state = initialState.newsState, action) => {
    switch (action.type) {
        case types.GET_NEWS_STATE_SUCCESS:
            return action.payload.data.status
        case types.SET_NEWS_STATE_SUCCESS:
            return state == 0 ? 1 : 0;
        default:
            return state;
    }
}

const news = (state = initialState.news, action) => {
    switch (action.type) {
        case types.GET_NEWS_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_NEWS_STATE_PENDING:
        case types.SET_NEWS_STATE_PENDING:
        case types.DELETE_NEWS_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.GET_NEWS_STATE_ERROR:
        case types.SET_NEWS_STATE_ERROR:
        case types.DELETE_NEWS_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const newsReducer = combineReducers({
    newsState,
    news,
    isPending,
    errors
});

export default newsReducer;
