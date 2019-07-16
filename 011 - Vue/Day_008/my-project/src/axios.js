import Vue from 'vue'
import axios from 'axios'
// 设置默认请求路径
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
    // 添加拦截器
axios.interceptors.request.use((config) => {
        // console.log(config)
        //挂载token,在登录之后的每次请求都会携带token以保持状态
        config.headers.Authorization = window.sessionStorage.getItem('token');
        // 一定要将config返回
        return config;
    })
    //将axios绑到vue原型上
Vue.prototype.$http = axios