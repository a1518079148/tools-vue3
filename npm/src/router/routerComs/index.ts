import home from './home'
import coms from './coms'
import login from './login'
import user from './user'
export default {
    '/': undefined,
    ...home,
    ...coms,
    ...login,
    ...user
}
