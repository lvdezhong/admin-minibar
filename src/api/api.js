import { toQueryString, md5, sortObject } from '../utils'
import { browserHistory } from 'react-router'

// 本地
// const appInfo = {
//     baseURI: 'http://api.mockuai.com:8091',
//     app_key: '5b036edd2fe8730db1983368a122fb45',
//     app_pwd: '84ef0ca439e44fa93c4375ff94b420c7'
// }

// 测试环境
const appInfo = {
    baseURI: 'http://api.minibar.mockuai.com:8091',
    app_key: '3fc22da4e4b7bb17d04d1bcb5510ed8c',
    app_pwd: 'd8f2622865f31f0b6788e14a9d05acaa'
}

// 亚通线上
// const appInfo = {
//     baseURI: 'http://api.minibar.mockuai.com',
//     app_key: '732107fc97120ce6777c2f821c3a0679',
//     app_pwd: '60a7b01e91cf29e3ade371b7f8a369dc'
// }

// 魔筷线上
// const appInfo = {
//     baseURI: 'http://api.minibar.mockuai.com',
//     app_key: '1435a07bcf93045ee631619978ef18ec',
//     app_pwd: '2a94f6b9b969b3e01e32acb18d0c605a'
// }

function makeSign(params) {
    var app_pwd = appInfo.app_pwd;
    params = sortObject(params);

    var dictionary = app_pwd;
    for (var key in params) {
        dictionary += (key+'='+params[key]+'&');
    }

    dictionary = dictionary.slice(0, -1);
    dictionary += app_pwd;
    var api_sign = md5(dictionary);
    return api_sign;
}

function handleResponse(data, resolve, reject) {
    switch (data.code) {
        case 10000:
            // 调用成功
            return resolve(data);
            break;
        case 50001:
        case 50002:
            // 缺少参数session_token
            getSession(true);
            return reject(data);
            break;
        case 50003:
        case 50004:
            // 缺少access_token
            browserHistory.push('/login');
            return reject(data);
            break;
        default:
            // 其他情况
            return reject(data);
    }
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        console.log(response.statusText);
    }
}

function json(response) {
    return response.json();
}

function getSession(isChange) {
    let sessionApiPath = '/minibar/auth/session_token/get';

    return new Promise(function (resolve, reject) {
        if (isChange) {
            localStorage.removeItem('session_token');
        }

        const session_token = localStorage.getItem('session_token');

        if (session_token) {
            resolve();
        } else {
            let data = {
                app_key: appInfo.app_key
            }

            data.api_sign = makeSign(data);

            fetch(appInfo.baseURI + sessionApiPath + '?' + toQueryString(data))
            .then(status)
            .then(json)
            .then(function(data) {
                if (data.code === 10000) {
                    localStorage.setItem('session_token', data.data.session_token);
                    resolve();
                } else {
                    reject(data);
                }
            })
        }
    })
}

function doFetch(path, params, type, isMock) {
    const session_token = localStorage.getItem('session_token') || '';
    const access_token = localStorage.getItem('access_token') || '';

    let data = Object.assign({}, params, {
        app_key: appInfo.app_key,
        session_token: session_token,
        access_token: access_token
    });

    data.api_sign = makeSign(data);

    return new Promise(function (resolve, reject) {
        if (isMock) {
            handleResponse(path, resolve, reject);
            return;
        }

        if (type == 'GET') {
            fetch(appInfo.baseURI + path + '?' + toQueryString(data))
            .then(status)
            .then(json)
            .then(function(data) {
                handleResponse(data, resolve, reject);
            })
        } else if (type == 'POST') {
            fetch(appInfo.baseURI + path, {
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: toQueryString(data)
            })
            .then(status)
            .then(json)
            .then(function(data) {
                handleResponse(data, resolve, reject);
            })
        }
    })
}

class _Api {
    constructor(opts) {
        this.opts = opts || {};
    }

    get(path, { params } = {}, isMock) {
        return getSession(false).then(function() {
            return doFetch(path, params, 'GET', isMock);
        })
    }

    post(path, { params } = {}, isMock) {
        return getSession(false).then(function() {
            return doFetch(path, params, 'POST', isMock);
        })
    }
}

const Api = _Api;
export default Api;
