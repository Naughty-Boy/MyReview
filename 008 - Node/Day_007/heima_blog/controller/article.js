module.exports = {
    showArticlePage: (req, res) => {
        //如果没有登录，则返回主页
        if (!req.session.isLogin) return res.redirect('/')
            //登录的情况下，则返回添加文章页面
        res.render('./article/add.ejs', {
            user: req.session.user,
            isLogin: req.session.isLogin
        })
    }
}