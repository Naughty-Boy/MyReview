const moment = require('moment')
const conn = require('../db/index.js');
//使用marked包工具，帮我们将markeDown文本装换成HTML
const marked = require('marked');
module.exports = {
    showArticlePage: (req, res) => {
        //如果没有登录，则返回主页
        if (!req.session.isLogin) return res.redirect('/')
            //登录的情况下，则返回添加文章页面
        res.render('./article/add.ejs', {
            user: req.session.user,
            isLogin: req.session.isLogin
        })
    },
    addArticle: (req, res) => {
        const body = req.body;
        body.authorId = req.session.user.id;
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
        // console.log(body)
        //打印结果： { authorId: 1,
        //     title: 'asd',
        //     content: 'asd',
        //     ctime: '2019-07-05 14:57:29' }
        // 插入数据库
        const sql = 'insert into blog_articles set ?';
        conn.query(sql, body, function(err, result) {
            if (err) return res.send({ msg: '插入数据库失败', status: 501 });
            //如果影响额行数不为1的话，报错
            if (result.affectedRows != 1) return res.send({ msg: '插入数据库失败', status: 502 })
                //正常插入
            res.send({ msg: '发表成功', status: 200, insertId: result.insertId });
        })
    },
    showArticleDetail: (req, res) => {
        // 通过路由参数获取id
        // res.send(req.params)
        const id = req.params.id;
        //数据库查询语句
        const sql = 'select * from blog_articles where id=?';
        conn.query(sql, id, (err, result) => {
            if (err) return res.send({ msg: '获取文章详情出错', status: 500 });
            //如果查询结果中长度为0，表示没有该文章
            if (result.length != 1) return res.send({ msg: '没有该文章', status: 501 });
            //查询成功返回
            // res.send({ msg: '获取成功', status: 200, result: result[0] });
            // 返回渲染的详情页面
            // res.render('./article/info.ejs', { isLogin: req.session.isLogin, user: req.session.user, result: result[0] });
            // 在返回之前将文章markeDown内容转换html
            const html = marked(result[0].content);
            result[0].content = html;
            res.render('./article/info.ejs', { isLogin: req.session.isLogin, user: req.session.user, result: result[0] });
        })
    },
    edit: (req, res) => {
        // 用户如果没有登录，则重定向到首页
        if (!req.session.isLogin) { return res.redirect('/') };
        //查询对应文章数据，进行渲染返回
        const sql = 'select * from blog_articles where id=?';
        conn.query(sql, req.params.id, (err, result) => {
            if (err) return res.send({ msg: '服务器异常', status: 500 });
            if (result.length != 1) return res.send({ msg: '没有该文章', status: 501 });
            res.render('article/edit.ejs', { isLogin: req.session.isLogin, user: req.session.user, result: result[0] })
        })
    },
    saveEdit: (req, res) => {
        //获取用户提交的表单数据
        const body = req.body;
        //更新数据库语句
        const sql = 'update blog_articles set ? where id=?';
        conn.query(sql, [body, body.id], (err, result) => {
            if (err) return res.send({ msg: '数据库更新失败', status: 500 });
            res.send({ msg: '保存成功', status: 200 });
        })
    }
}