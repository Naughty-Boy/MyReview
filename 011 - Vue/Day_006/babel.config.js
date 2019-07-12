// babel预配置
const presets = [
    //目标兼容环境
    ["@babel/env", {
        targets: {
            edge: "17",
            firefox: "60",
            chrome: "67",
            safari: "11.1"
        }
    }]
];
//暴露对象
module.exports = { presets }