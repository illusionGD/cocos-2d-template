import { TIMESTAMP_NUMBER } from '../data/constants'

/**
 * 校验是否为纯粹的对象
 * @param obj
 */
export function isPlainObject(obj) {
    let proto, Ctor
    if (!obj || typeof obj !== 'object') return false
    proto = Object.getPrototypeOf(obj)
    if (!proto) return true
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor
    return typeof Ctor === 'function' && Ctor === Object
}
/**是否为无效值 */
export function isInvalidVal(val: any) {
    return [NaN, undefined, null, 'null', 'undefined', 'NaN'].indexOf(val) >= 0
}

/**
 * 将对象转成参数
 * @param obj 对象
 * @param isEncode 是否encode
 * @returns a=1&b=2...
 */
export function qsString(obj: any, isEncode: boolean = true) {
    if (obj instanceof Object) {
        let str = ''
        Object.keys(obj).forEach((key, index) => {
            str += `${index ? '&' : ''}${key}=${
                isEncode ? encodeURIComponent(obj[key]) : obj[key]
            }`
        })
        return str
    } else if (typeof obj === 'string') {
        return obj
    } else if (typeof obj === 'number') {
        return `${obj}`
    } else {
        return ''
    }
}

/**获取cookie */
export function getCookie(name: string) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

/**
 * 设置cookie
 * @param key
 * @param val
 * @param time 过期时间：默认一天
 * @param domain 域名
 */
export function setCookie(
    key: string,
    val: string,
    time: number = TIMESTAMP_NUMBER.day,
    domain?: string
) {
    const date = new Date()

    date.setTime(date.getTime() + time)

    const expires = '; expires=' + date.toUTCString()

    let cookieString = `${key}=${val || ''}${expires}; path=/`

    if (domain) {
        cookieString += `; domain=${domain}`
    }

    document.cookie = cookieString
}

/**
 * 删除cookie
 * @param name
 */
export function delCookie(name: string) {
    setCookie(name, '', -0)
}

/**解析url参数并转成对象 */
export function parseUrlParams(url: string): Record<string, string | string[]> {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)
    const result: Record<string, string | string[]> = {}

    params.forEach((value, key) => {
        if (result[key]) {
            if (Array.isArray(result[key])) {
                ;(result[key] as string[]).push(value)
            } else {
                result[key] = [result[key] as string, value]
            }
        } else {
            result[key] = value
        }
    })

    return result
}

/**
 * 格式化post请求的body
 * @param body
 * @param contentType
 */
export function formatPostBody(
    body: XMLHttpRequestBodyInit,
    contentType: string
) {
    if (contentType.includes('urlencoded')) return qsString(body)
    if (contentType.includes('json'))
        return typeof body === 'string' ? body : JSON.stringify(body)
}
