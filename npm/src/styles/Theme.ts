import { CookieUtil } from 'tools-vue3'

export default class Theme {
    /**
     * 默认风格
     */
    static USE: string = 'light'

    /**
     * 可选列表
     */
    static list: any = ['light', 'drak']

    static init() {
        let themeStr: string = CookieUtil.get('themeStr')
        if (StrUtil.isNull(themeStr)) {
            CookieUtil.set('themeStr', Theme.USE)
            themeStr = Theme.USE
        }

        let app: any = document.getElementsByTagName('body')[0]
        app.className = themeStr + '-theme'

        Theme.USE = themeStr
    }

    static change(name: string) {
        CookieUtil.set('themeStr', name)
        let app: any = document.getElementsByTagName('body')[0]
        app.className = name + '-theme'
        Theme.USE = name
    }
}
