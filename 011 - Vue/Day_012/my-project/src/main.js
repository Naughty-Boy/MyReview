import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/tableWithTreeConf.js'
import './plugins/filters.js'
//导入全局样式文件
import './assets/css/global.css'
//导入字体图标
import './assets/font-awesome-4.7.0/css/font-awesome.min.css'
// 导入axios文件
import './axios.js'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')