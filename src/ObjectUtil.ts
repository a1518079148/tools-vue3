export default class ObjectUtil {
    static objectToString = Object.prototype.toString

    static toTypeString = (value: unknown): string => ObjectUtil.objectToString.call(value)

    static isArray = Array.isArray

    static isMap = (val: unknown): val is Map<any, any> => ObjectUtil.toTypeString(val) === '[object Map]'

    static isSet = (val: unknown): val is Set<any> => ObjectUtil.toTypeString(val) === '[object Set]'

    static isDate = (val: unknown): val is Date => ObjectUtil.toTypeString(val) === '[object Date]'

    static isFunction = (val: unknown): val is Function => typeof val === 'function'

    static isString = (val: unknown): val is string => typeof val === 'string'

    static isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

    static isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

    static isPromise = <T = any>(val: unknown): val is Promise<T> => {
        return ObjectUtil.isObject(val) && ObjectUtil.isFunction(val.then) && ObjectUtil.isFunction(val.catch)
    }

    /**
     * 遍历对象中的每一个key和value
     * @param obj Object、Array
     */
    static getObject = (obj: any, fun: (key: string, value: any) => any) => {
        if (this.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                this.getObject(obj[i], fun)
            }
        } else if (this.isObject(obj)) {
            Object.keys(obj).forEach((key) => {
                const item = obj[key]
                fun(key, item)
                if (this.isArray(item) || this.isObject(item)) {
                    this.getObject(item, fun)
                }
            })
        }
    }

    /**
     * 深度合并对象，老字段覆盖值或保留，新字段新增
     * @param obj1
     * @param obj2
     * @returns
     */
    static deepMerge = (obj1: any, obj2: any): any => {
        const mergedObj = { ...obj1 }
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj2[key] === 'object' && obj1.hasOwnProperty(key) && typeof obj1[key] === 'object') {
                    mergedObj[key] = ObjectUtil.deepMerge(obj1[key], obj2[key])
                } else {
                    mergedObj[key] = obj2[key]
                }
            }
        }

        return mergedObj
    }
}
