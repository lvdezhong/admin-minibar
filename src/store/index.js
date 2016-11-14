import {
    createStore,
    applyMiddleware,
    compose
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'

import rootReducer from './reducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    promiseMiddleware({
        promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']
    })
)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState, compose(window.devToolsExtension ? window.devToolsExtension() : f => f));
}
