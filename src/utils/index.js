function toQueryPair(key, value) {
    if (typeof value == 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}

export function isPromise(value) {
    if (value !== null && typeof value === 'object') {
        return value.promise && typeof value.promise.then === 'function';
    }
}

export function toQueryString(obj) {
    let ret = [];
    for (let key in obj) {
        key = encodeURIComponent(key);
        let values = obj[key];
        ret.push(toQueryPair(key, values));
    }
    return ret.join('&');
}

export function price(type, price) {
    if (price == '' || price == undefined) {
        return price;
    } else {
        if (type == 'POST') {
            return (price * 100).toFixed(0);
        } else if (type == 'GET') {
            return (price / 100).toFixed(2);
        }
    }
}

// topics
export const CLICK_GOODS_ITEM = "clickGoodsItem"
export const UPDATE_GOODS_ITEM = "updateGoodsItem"
