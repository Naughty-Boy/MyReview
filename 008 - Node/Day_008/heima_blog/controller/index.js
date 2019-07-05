const conn = require('../db/index.js');
// 展示首页页面
const showIndexPage = (req, res) => {
    // 自定义每页展示的条数
    const pageSize = 4;
    // 记录当前页码
    const pageIndex = Number(req.query.pageIndex) || 1;
    // console.log(req.query)
    const limit = (pageIndex - 1) * pageSize;
    // 从数据库中联表查询出文章列表进行渲染
    //开启multipleStatements，由于分页要获取文章的总数，所以同时写入两条SQL语句，使用；隔开
    const sql = 'select blog_articles.id,blog_articles.title,blog_articles.ctime,blog_users.username from blog_articles LEFT JOIN blog_users on blog_articles.authorId=blog_users.id ORDER BY blog_articles.id DESC LIMIT ' + limit + ',' + pageSize + ';SELECT COUNT(*) AS COUNT FROM blog_articles'
    conn.query(sql, (err, result) => {
        // console.log(result)  //多条语句同时查询返回的结果作为数组的成员
        if (err) return res.send({ msg: '查询失败', status: 500 });
        // 文章总条数
        // console.log(result[1][0].COUNT)
        //分页数=总页数/每一页的条数
        const count = Math.ceil(result[1][0].COUNT / pageSize);
        // 使用 render 函数之前，一定要保证安装和配置了 ejs 模板引擎
        res.render('index.ejs', { isLogin: req.session.isLogin, user: req.session.user, result: result[0], count: count, pageIndex: pageIndex, pageSize: pageSize })
    })
}

module.exports = {
    showIndexPage
}