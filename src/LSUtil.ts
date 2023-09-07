/**
 * localStorage缓存工具
 * @param 说明 -将数据存入localStorage
 */
export default class LSUtil {
    /**
     * 设置
     */
    static set(key: string, value: any) {
        localStorage?.setItem(key, <string>value)
    }

    /**
     * 获取指定值
     */
    static get(key: string): any {
        return localStorage?.getItem(key)
    }
}
