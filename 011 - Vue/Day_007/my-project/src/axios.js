import Vue from 'vue'
import axios from 'axios'
// 设置默认请求路径
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
    //将axios绑到vue原型上
Vue.prototype.$http = axios