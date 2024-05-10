import { AnyObject } from '../interfaces'
import fetchRequest from './fetch'
import jsonp from './jsonp'

class RequestAdapter {
    supportFetch = true

    constructor() {
        this.supportFetch = !!window.fetch
    }

    get<T>(url: string, params: AnyObject) {
        if (this.supportFetch) {
            return fetchRequest<T>(url, {
                method: 'GET',
                params,
            })
        }
    }

    post<T>(url: string, params: AnyObject) {
        if (this.supportFetch) {
            return fetchRequest<T>(url, {
                method: 'POST',
                body: params,
            })
        }
    }

    jsonp = jsonp
}

const request = new RequestAdapter()

export default request
