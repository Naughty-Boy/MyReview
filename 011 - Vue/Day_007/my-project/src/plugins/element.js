import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
//导入message弹框，引用方式为向vue原型挂载自定义属性，参考elementui官网
import { Message } from 'element-ui'
//导入MessageBox弹框，引用方式同样需要添加在Vue原型上
import { MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$alert = Message
Vue.prototype.$confirm = MessageBox