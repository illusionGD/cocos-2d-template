export interface AnyObject {
    [key: string | symbol | number]: any
}

export interface BaseRequestOptionsType {
    method?: string
    params?: AnyObject | null
    body?: any
    headers?: AnyObject | null
    cache?: RequestCache
    credentials?: RequestCredentials
    responseType?: ResponseType
    timeout?: number
}

export interface ResponseResultType<T> {
    data: T
    status: number
    headers: AnyObject
    statusText: string
}

export enum ResponseType {
    JSON = 'JSON',
    TEXT = 'TEXT',
    BLOB = 'BLOB',
    ARRAYBUFFER = 'ARRAYBUFFER',
}
