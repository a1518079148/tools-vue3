export default [
    {
        path: '/',
        redirect: '/home'
    },
    {
        name: 'home',
        path: '/home',
        component: 'home'
    },
    {
        name: 'login',
        path: '/login',
        component: 'login'
    },
    {
        name: 'coms',
        path: '/coms',
        component: 'coms',
        children: [
            {
                name: 'button',
                path: '/coms/button',
                component: 'button'
            }
        ]
    }
]
