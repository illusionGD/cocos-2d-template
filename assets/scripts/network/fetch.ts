import qs from 'qs'
import { isPlainObject } from '../uitls'

const inital = {
    method: 'GET',
    params: null,
    body: null,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    cache: 'no-cache',
    credentials: 'include',
    responseType: 'JSON',
}
enum RESPONSE_TYPE {
    JSON = 'JSON',
    TEXT = 'TEXT',
    BLOB = 'BLOB',
    ARRAYBUFFER = 'ARRAYBUFFER',
}

interface REQUEST_TYPE {
    method?
    params?
    body?
    headers?
    cache?
    credentials?
    responseType?: RESPONSE_TYPE
}

export default function fetchRequest<T>(
    url: string,
    config?: REQUEST_TYPE
): Promise<T> {
    // init params
    if (typeof url !== 'string')
        throw new TypeError('url must be required and of string type')
    if (!isPlainObject(config)) config = {}

    config = Object.assign({}, inital, config)

    let { method, params, body, headers, cache, credentials, responseType } =
        config

    if (params != null) {
        if (isPlainObject(params)) params = qs.stringify(params)
        url += `${url.includes('?') ? '&' : '?'}${params}`
    }

    // 根据自己的需求来:body传递的是普通对象，我们今天项目需要传递给服务器的是URLENCODED格式，我们才处理它的格式；如果用户传递的本身就不是普通对象(例如:文件流、字符串、FORM-DATA...)，还是以用户自己写的为主...
    if (isPlainObject(body)) {
        let contentType = headers['Content-Type'] || 'application/json' //默认application/json
        if (contentType.includes('urlencoded')) body = qs.stringify(body)
        if (contentType.includes('json')) body = JSON.stringify(body)
    }

    // 把config配置成为fetch需要的对象
    config = {
        method: method.toUpperCase(),
        headers,
        credentials,
        cache,
    }

    if (/^(POST|PUT|PATCH)$/i.test(method) && body != null) config.body = body

    // 发送请求
    return fetch(url, config)
        .then((response) => {
            const { status, statusText } = response
            // 只要状态码是以2或者3开始的，才是真正的获取成功
            if (status >= 200 && status < 400) {
                let result
                switch (responseType.toUpperCase()) {
                    case 'JSON':
                        result = response.json()
                        break
                    case 'TEXT':
                        result = response.text()
                        break
                    case 'BLOB':
                        result = response.blob()
                        break
                    case 'ARRAYBUFFER':
                        result = response.arrayBuffer()
                        break
                }
                return result
            }
            return Promise.reject({
                code: 'STATUS ERROR',
                status,
                statusText,
            })
        })
        .catch((reason) => {
            if (reason && reason.code === 'STATUS ERROR') {
                // @1 状态码错误
                switch (reason.status) {
                    case 400:
                        // ...
                        break
                    case 401:
                        // ...
                        break
                    case 404:
                        // ...
                        break
                }
            } else if (!navigator.onLine) {
                // @2 网络中断
                // ...
            } else {
                // @3 请求被终止
                // ...
            }
            return Promise.reject(reason)
        })
}
