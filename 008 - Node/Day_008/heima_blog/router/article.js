const express = require('express')
const router = express.Router()

// 导入 用户相关的 处理函数模块
const ctrl = require('../controller/article.js')
router.get('/article/add', ctrl.showArticlePage)
router.post('/article/add', ctrl.addArticle)
router.get('/article/info/:id', ctrl.showArticleDetail)
router.get('/article/edit/:id', ctrl.edit)
router.post('/article/edit', ctrl.saveEdit)
module.exports = router;