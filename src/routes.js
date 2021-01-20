import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-user',
        leaf: true,//只有一个节点
        children: [
            {path: '/user', component: () => import('@/views/user/list'), name: '用户列表'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品',
        iconCls: 'el-icon-user',
        children: [
            {
                path: '/commodity',
                component: () => import('@/views/commodity/list'),
                name: '商品列表'
            },
            {
                path: '/commodity/add',
                component: () => import('@/views/commodity/add'),
                name: '添加商品'
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单',
        iconCls: 'el-icon-user',
        leaf: true, //只有一个节点
        children: [
            {
                path: '/order',
                component: () => import('@/views/order/list'),
                name: '订单列表'
            },
            {
                path: '/orderDetail',
                component: () => import('@/views/order/orderDetail'),
                name: '订单详情',
                hidden: false
            }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;
