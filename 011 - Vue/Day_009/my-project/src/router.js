import Vue from 'vue'
import Router from 'vue-router'
//导入Login组件
import Login from './components/Login.vue'
// 导入Home组件
import Home from './components/Home.vue'
//导入Welcome组件
import Welcome from './components/Welcome.vue'
//导入Users组件
import Users from './components/user/Users.vue'
//导入Promise组件
import Promise from './components/power/Promise.vue'
//导入Roles组件
import Roles from './components/power/Roles.vue'

Vue.use(Router)

let router = new Router({
        routes: [{
            path: '/',
            redirect: '/login'
        }, {
            path: '/login',
            component: Login,
            name: 'login'
        }, {
            path: '/home',
            component: Home,
            name: 'home',
            redirect: '/welcome',
            // 子路由
            children: [{
                // 默认欢迎组件
                path: '/welcome',
                component: Welcome,
                name: 'welcome'
            }, {
                // 用户组件
                path: '/users',
                name: 'users',
                component: Users
            }, {
                //权限组件
                path: '/rights',
                name: 'promise',
                component: Promise
            }, {
                //角色组件
                path: '/roles',
                name: 'roles',
                component: Roles
            }]
        }]
    })
    //路由守卫，看用户时候有权限进入某个页面
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        next();
    } else {
        const tokenStr = window.sessionStorage.getItem('token');
        // console.log(tokenStr)
        if (!tokenStr) {
            next('/login');
        } else {
            next();
        }
    }
})
export default router;