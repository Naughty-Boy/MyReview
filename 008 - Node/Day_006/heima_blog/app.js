//入口文件
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const moment = require('moment');
const conn = mysql.createConnection({
        host: '127.0.0.1',
        database: 'heima_blog',
        user: 'root',
        password: 'root'
    })
    //设置模板引擎
app.set('view engine', 'ejs');
//设置模板存放路径
app.set('views', path.join(__dirname, './views'));
//注册中间件
app.use(bodyParser.urlencoded({ extended: false }));
// 托管静态目录
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')))
app.get('/', function(req, res) {
    res.render(path.join(__dirname, './views/index.ejs'), {})
})
app.get('/register', function(req, res) {
    //render函数参照的路径为渲染引擎指定的模板路径
    res.render('./user/register.ejs', {});
})
app.get('/login', function(req, res) {
    //render函数参照的路径为渲染引擎指定的模板路径
    res.render('./user/login.ejs', {});
})
app.post('/register', function(req, res) {
        const body = req.body;
        console.log(body)
            // 判断用户提交的数据是否合法
        if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
            return res.send({ msg: '请重新输入', status: 501 });
        }
        // 查询数据库看是否重复
        const sql = 'select count(*) as count from blog_users where username=?';
        conn.query(sql, body.username, function(err, result) {
            if (err) { return res.send({ msg: '用户名查重失败', status: 501 }) }
            if (result[0].count !== 0) return res.send({ msg: '请更换其他用户名', status: 502 });
            //如果以上都通过则执行注册的业务逻辑
            body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
            const sql = 'insert into blog_users set ?';
            conn.query(sql, body, function(err, result) {
                if (err) return res.send({ msg: '用户名查重失败', status: 501 });
                res.send({ msg: '注册成功', status: 200 })
            })
        })
    })
    //开启网络监听
app.listen(8080, () => {
    console.log('8080端口服务已开启');
})