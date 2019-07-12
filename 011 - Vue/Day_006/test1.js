//ES6模块化规范，导入导出练习
const a = '我是a';
const b = '我是b';
const c = '我是c';

function speak() {
    console.log('Hello!');
}

// 默认导出模块对象
export default {
    a,
    b,
    speak
}