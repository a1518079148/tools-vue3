import System from '~/utils/System'

export default class ApiUser {
    /** 登录验证 */
    static loginPc(UserName: string, Password: string) {
        let param = {
            UserName,
            Password
        }
        return System.http.get(
            {
                url: '/User/loginPc',
                method: 'post'
            },
            param
        )
    }
}
