// 按需导出练习
const s1 = "我是s1";
const s2 = "我是s2";

function speak() {
    console.log('Hello,我是test2');
}
export let a = s1;
export let b = s2;
export default {
    speak
}
// SyntaxError:一个模块中只能使用一次export default
// export default {

// }