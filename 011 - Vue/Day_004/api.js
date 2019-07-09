const express = require('express');
const app = express();
const bodyParser = require('body-parser')
    // 将当前目录挂载为静态资源
app.use(express.static('./'));
//注册解析post提交参数的中间件
app.use(bodyParser.urlencoded({ extended: false })); //解析post表单数据
app.use(bodyParser.json()); //解析post的json数据
// 三个简单的测试接口
app.get('/info', (req, res) => {
    setTimeout(function() {
        res.send("I'm first api info.");
    }, 1000);
})
app.get('/info2', (req, res) => {
    setTimeout(function() {
        res.send("I'm second api info.");
    }, 2000);
})
app.get('/info3', (req, res) => {
        setTimeout(function() {
            res.send("I'm third api info.");
        }, 3000);
    })
    // 返回一个对象接口
app.get('/getObj', (req, res) => {
        res.send({ name: "list", age: 24, gender: "man" })
    })
    // 接收参数的接口
app.get('/query', (req, res) => {
    res.send('GET接收传递的id为：' + req.query.id)
})
app.get('/params/:id', (req, res) => {
    res.send('GET接收传递的id为：' + req.params.id)
})
app.delete('/delete', (req, res) => {
    res.send("delete接收传递的id为：" + req.query.id)
})
app.delete('/delete/:id', (req, res) => {
    res.send("delete接收传递的id为：" + req.params.id)
})
app.post('/post', (req, res) => {
    console.log(req.body)
    res.send('POST接收的参数为：' + 'name=' + req.body.name + '---' + 'age=' + req.body.age)
})
app.put('/put/:id', (req, res) => {
    res.send('PUT接收的参数为：' + 'id=' + req.params.id + '---' + 'name=' + req.body.name + '---' + 'age=' + req.body.age)
})
app.listen(8080, () => {
    console.log('8080端口服务已开启...')
})