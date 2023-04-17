import { reactive } from 'vue'

/**
 * 系统参数
 */
const sys = reactive({
    auth: {
        list: ['/api/system/list', '/api/system/detail'] as string[],
        isPass: (auth: string) => {
            return sys.auth.list.includes(auth)
        }
    }
})

export default sys
