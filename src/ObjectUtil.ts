

export default class ObjectUtil {

    static objectToString = Object.prototype.toString

    static toTypeString = (value: unknown): string =>
        ObjectUtil.objectToString.call(value)

    static isArray = Array.isArray

    static isMap = (val: unknown): val is Map<any, any> =>
        ObjectUtil.toTypeString(val) === '[object Map]'

    static isSet = (val: unknown): val is Set<any> =>
        ObjectUtil.toTypeString(val) === '[object Set]'

    static isDate = (val: unknown): val is Date =>
        ObjectUtil.toTypeString(val) === '[object Date]'

    static isFunction = (val: unknown): val is Function =>
        typeof val === 'function'

    static isString = (val: unknown): val is string => typeof val === 'string'

    static isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

    static isObject = (val: unknown): val is Record<any, any> =>
        val !== null && typeof val === 'object'

    static isPromise = <T = any>(val: unknown): val is Promise<T> => {
        return ObjectUtil.isObject(val) && ObjectUtil.isFunction(val.then) && ObjectUtil.isFunction(val.catch)
    }

}