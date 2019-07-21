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
//导入Cate组件
import Cate from './components/goods/Cate.vue'
// 导入Params组件
import Params from './components/goods/Params.vue'
// 导入Order组件
import Order from './components/order/Order.vue'
// 导入Report组件
import Report from './components/report/Report.vue'
//导入CateList组件
import CateList from './components/goods/CateList.vue'
//导入AddCate组件
import AddCate from './components/goods/AddCate.vue'

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
            }, {
                //商品列表组件
                path: '/goods',
                name: 'cateList',
                component: CateList
            }, {
                //添加商品
                path: '/goods/add',
                name: 'addCate',
                component: AddCate
            }, {
                // 商品分类组件
                path: '/categories',
                name: 'cate',
                component: Cate
            }, {
                //商品参数组件
                path: '/params',
                name: 'params',
                component: Params
            }, {
                //订单列表组件
                path: '/orders',
                name: 'orders',
                component: Order
            }, {
                //折线图组件
                path: '/reports',
                name: 'report',
                component: Report
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