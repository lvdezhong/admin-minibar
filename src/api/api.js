import { toQueryString, md5, sortObject } from '../utils'
import { browserHistory } from 'react-router'
import mock from '../mock/index.json'

// 本地
// const appInfo = {
//     app_key: '5b036edd2fe8730db1983368a122fb45',
//     app_pwd: '84ef0ca439e44fa93c4375ff94b420c7'
// }

// 测试环境
// const appInfo = {
//     app_key: '3fc22da4e4b7bb17d04d1bcb5510ed8c',
//     app_pwd: 'd8f2622865f31f0b6788e14a9d05acaa'
// }

// 亚通线上
// const appInfo = {
//     app_key: '732107fc97120ce6777c2f821c3a0679',
//     app_pwd: '60a7b01e91cf29e3ade371b7f8a369dc'
// }

// 魔筷线上
const appInfo = {
    app_key: '1435a07bcf93045ee631619978ef18ec',
    app_pwd: '2a94f6b9b969b3e01e32acb18d0c605a'
}

function makeSign(params) {
    const app_pwd = appInfo.app_pwd;
    params = sortObject(params);

    let dictionary = app_pwd;
    for (let key in params) {
        dictionary += (key+'='+params[key]+'&');
    }

    dictionary = dictionary.slice(0, -1);
    dictionary += app_pwd;
    const api_sign = md5(dictionary);
    return api_sign;
}

function handleResponse(code, baseURI) {
    switch (code) {
        case 10000: // 调用成功
            return true;
            break;
        case 50001: // 缺少参数session_token
        case 50002:
            getSession(baseURI);
            return false;
            break;
        case 50003: // 缺少access_token
        case 50004:
            browserHistory.push('/login');
            return false;
            break;
        default: // 其他情况
            return false;
    }
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response.statusText);
    }
}

function json(response) {
    return response.json();
}

function getSession(baseURI, isChange = true, callback) {
    if (isChange) {
        localStorage.removeItem('session_token');
    }

    const sessionApiPath = '/minibar/auth/session_token/get';
    const session_token = localStorage.getItem('session_token');

    if (session_token) {
        callback && callback();
    } else {
        let data = {
            app_key: appInfo.app_key
        }
        data.api_sign = makeSign(data);

        const req = new Request(baseURI + sessionApiPath + '?' + toQueryString(data));

        fetch(req)
        .then(status)
        .then(json)
        .then(data => {
            localStorage.setItem('session_token', data.data.session_token);
            callback && callback();
        })
    }
}

const methods = [
    'get',
    'post'
]

class Api {
    constructor(opts) {
        this.opts = opts || {};

        methods.forEach(method => this[method] = (path, params = {}, isMock = false) => new Promise((resolve, reject) => {
            if (isMock) {
                let data = mock[path];
                handleResponse(data.code, this.opts.baseURI) ? resolve(data) : reject(data);
                return;
            }

            getSession(this.opts.baseURI, false, () => {
                const session_token = localStorage.getItem('session_token') || '';
                const access_token = localStorage.getItem('access_token') || '';

                let data = Object.assign({}, params, {
                    app_key: appInfo.app_key,
                    session_token: session_token,
                    access_token: access_token
                });
                data.api_sign = makeSign(data);

                if (method === 'get') {
                    var req = new Request(this.opts.baseURI + path + '?' + toQueryString(data));
                } else {
                    var req = new Request(this.opts.baseURI + path, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: toQueryString(data)
                    });
                }

                fetch(req)
                .then(status)
                .then(json)
                .then(data => {
                    handleResponse(data.code, this.opts.baseURI) ? resolve(data) : reject(data);
                })
            })
        }))
    }
}

export default Api;
