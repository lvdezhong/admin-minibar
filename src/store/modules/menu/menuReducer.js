import {
    GET_ALL_MENU,
    UPDATE_NAVPATH
} from './menuAction'

import menuData from '../../../data/menu'

const initialState = {
    currentIndex: 0,
    items: [],
    navpath: []
};

export default function menu(state = initialState, action = {}) {
    switch (action.type) {
        case GET_ALL_MENU:
            return Object.assign({}, initialState, {
                items: menuData
            });
        case UPDATE_NAVPATH:
            let navpath = [],
                tmpOb, tmpKey, child;
            if (action.payload.path) {
                action.payload.path.reverse().map((item) => {
                    if (item.indexOf('sub') != -1) {
                        tmpKey = item.replace('sub', '');
                        tmpOb = _.find(state.items, function(o) {
                            return o.key == tmpKey;
                        });
                        child = tmpOb.child;
                        navpath.push({
                            key: tmpOb.key,
                            name: tmpOb.name
                        })
                    }
                    if (item.indexOf('menu') != -1) {
                        tmpKey = item.replace('menu', '');
                        if (child) {
                            tmpOb = _.find(child, function(o) {
                                return o.key == tmpKey;
                            });
                        }
                        navpath.push({
                            key: tmpOb.key,
                            name: tmpOb.name
                        })
                    }
                })
            }
            return Object.assign({}, state, {
                currentIndex: action.payload.key * 1,
                navpath: navpath
            });
        default:
            return state;
    }
}
