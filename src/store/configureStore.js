import {
    createStore,
    applyMiddleware,
    combineReducers,
    compose
} from 'redux'

import thunkMiddleware from 'redux-thunk'

import promiseMiddleware from '../middlewares/promiseMiddleware'

import user from '../reducers/user'
import menu from '../reducers/menu'
import device from '../reducers/device'
import maintpl from '../reducers/maintpl'
import goods from '../reducers/goods'
import order from '../reducers/order'

const reducer = combineReducers({
    user,
    menu,
    device,
    maintpl,
    goods,
    order
});

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    promiseMiddleware({
        promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']
    })
)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(reducer, initialState, compose(window.devToolsExtension ? window.devToolsExtension() : f => f));
}
