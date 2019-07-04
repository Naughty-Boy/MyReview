const express = require('express')
const router = express.Router()

// 导入 用户相关的 处理函数模块
const ctrl = require('../controller/article.js')
router.get('/article/add', ctrl.showArticlePage)
module.exports = router;