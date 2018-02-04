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
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/record',
        icon: 'clipboard',
        name: 'record',
        title: '客户档案管理',
        component: Main,
        children:[
            { path: 'index', title: '客户档案管理', name: 'record_index', component:() => import('@/views/record-manage/record-manage.vue') }
        ]
    },
    {
        path: '/user',
        icon: 'person-stalker',
        name: 'user',
        title: '用户管理',
        component: Main,
        children:[
            { path: 'user-manage', title: '用户管理', name: 'user-manage', icon: 'ios-people', component:() => import('@/views/user-manage/user-manage.vue') },
            { path: 'user-access', title: '权限管理', name: 'user-access', icon: 'key', component: () => import('@/views/user-manage/access.vue') }
        ]
    },    
    {
        path: '/relation',
        icon: 'ios-color-filter',
        name: 'relation',
        title: '客户关系管理',
        component: Main,
        children:[
            { path: 'short_message_send', title: '短信发送', name: 'short_message_send', icon: 'android-send', component:() => import('@/views/relation-manage/short_message_send.vue') },
            { path: 'short_send_list', title: '已发送短信', name: 'short_send_list', icon: 'clipboard', component:() => import('@/views/relation-manage/short_send_list.vue') },
            { path: 'record-eyesight', title: '客户视力跟踪', name: 'record-eyesight', icon: 'clipboard', component:() => import('@/views/record-manage/record-eyesight.vue') },
        ]
    }
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
