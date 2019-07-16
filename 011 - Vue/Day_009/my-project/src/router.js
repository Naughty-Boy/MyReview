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
            children: [{
                path: '/welcome',
                component: Welcome,
                name: 'welcome'
            }, {
                path: '/users',
                name: 'users',
                component: Users
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