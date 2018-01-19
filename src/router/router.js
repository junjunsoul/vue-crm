import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
        ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '权限测试页',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
        ]
    },
    {
        path: '/international',
        icon: 'earth',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
        ]
    },
    {
        path: '/advanced-router',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [
            { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
            { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
        ]
    },
    {
        path: '/product',
        icon: 'clipboard',
        name: 'product',
        title: '商品资料管理',
        access: 0,
        component: Main,
        children:[
            { path: 'index', title: '商品资料管理', access: 0, name: 'product_index', component:() => import('@/views/product-manage/product-manage.vue') }
        ]
    },
    {
        path: '/record',
        icon: 'clipboard',
        name: 'record',
        title: '客户档案管理',
        access: 0,
        component: Main,
        children:[
            { path: 'index', title: '客户档案管理', access: 0, name: 'record_index', component:() => import('@/views/record-manage/record-manage.vue') }
        ]
    },
    {
        path: '/sell',
        icon: 'clipboard',
        name: 'sell',
        title: '销售管理',
        access: 0,
        component: Main,
        children:[
            { path: 'index', title: '销售管理', access: 0, name: 'sell_index', component:() => import('@/views/sell-manage/sell-manage.vue') }
        ]
    },
    {
        path: '/user',
        icon: 'clipboard',
        name: 'user',
        title: '用户管理',
        access: 0,
        component: Main,
        children:[
            { path: 'index', title: '用户管理', access: 0, name: 'user_index', component:() => import('@/views/user-manage/user-manage.vue') }
        ]
    },   
    {
        path: '/relation',
        icon: 'clipboard',
        name: 'relation',
        title: '客户关系管理',
        access: 0,
        component: Main,
        children:[
            { path: 'index', title: '客户关系管理', access: 0, name: 'relation_index', component:() => import('@/views/relation-manage/relation-manage.vue') }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [
            { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') }
        ]
    },
    // {
    //     path: '',
    //     icon: '',
    //     title: '',
    //     name: '',
    //     component: Main,
    //     children:[
    //         { path: '', title: '', access: 0, name: '', component:() => import('')}
    //     ]
    // },

];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
