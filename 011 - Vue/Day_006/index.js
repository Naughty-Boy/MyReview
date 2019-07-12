// 导入test1模块
import test1 from './test1.js';
// { a: '我是a', b: '我是b', speak: [Function: speak] }
// 没有c因为c没有导出
//如果test1，没有export default的话，默认为{}
console.log(test1)


//按需导入test2模块
// 按需导入的a,b需要用花括号包裹，并且变量名称要和导出的一致
// 如果需要给按需导出的变量设置别名，可以： import {a as aa} from './test2.js'
// import test2, { a, b } from './test2';
// console.log(test2, a, b)
import { a as aa } from './test2.js'
// ReferenceError: a is not defined
// console.log(a); 
console.log(aa)


//直接使用import导入test3，不接收对象，而是单纯的引入代码
import './test3.js'