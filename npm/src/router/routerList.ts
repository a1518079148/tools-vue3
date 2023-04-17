export default [
    {
        name: 'user',
        path: '/user',
        meta: {
            title: '用户页',
            show: true
        },
        component: 'user',
        children: [
            {
                name: 'userInfo',
                path: '/userInfo',
                meta: {
                    title: '用户详情页',
                    show: true
                },
                component: 'userInfo'
            }
        ]
    }
]
