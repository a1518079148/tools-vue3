import Cookies from 'js-cookie'

/**
 * 缓存工具
 * @param 说明 -优先存入js-cookie，当存入数据长度大于500存入localStorage(如果有)
 * @param domain -存入域本地取本地ip地址，域名取域名
 * @param expires -失效时间2e5
 */
export default class CookieUtil {
    static ckl = 500
    static lsTag = '#null'
    static domain: any = null

    /**
     * 设置
     */
    static set(key: string, value: any) {
        if (this.domain === null) {
            this.domain = window.location.hostname
        }
        value = value + ''
        if (value.length > this.ckl) {
            Cookies.set(key, this.lsTag, { expires: 2e5, domain: this.domain })
            localStorage?.setItem(key, <string>value)
        } else {
            const res = Cookies.get(key)
            if (res !== this.lsTag) Cookies.set(key, <string>value, { expires: 2e5, domain: this.domain })
            else localStorage?.setItem(key, <string>value)
        }
    }

    /**
     * 获取指定值
     */
    static get(key: string): any {
        const res = Cookies.get(key)
        if (res !== this.lsTag) return res
        else return localStorage?.getItem(key)
    }
}
