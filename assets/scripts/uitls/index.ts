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
