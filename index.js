const express = require("express");
const app = express();
// 表单验证规则
const joi = require("joi");
// 导入把加密文转换为json的包
const expressjwt = require("express-jwt");

// 解决跨域问题
const cors = require("cors");
app.use(cors());

//托管静态资源
app.use('/uploads', express.static("./uploads"))

//post表单数据解析中间件   application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// 解析 POST 提交过来的表单数据
// const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: false }))

// 自定义错误信息中间件 一定要在路由之前，封装 res.cc 函数
app.use(function (req, res, next) {
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 解密token unless({ path: [/^\/api\//] })指定api接口不需要进行token验证
//在配置路由之前
// 导入密钥
const secretKey = require("./secr/secr");
app.use(expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

// 导入登陆注册路由模块
const router = require("./Router/user");
app.use('/api', router);

// 导入用户信息路由模块
const user_router = require("./Router/userinfo");
app.use('/my', user_router);

// 导入文章分类模块
const articlesort_router = require("./Router/articlesort");
app.use('/sort', articlesort_router);

// 导入文章模块
const article_router = require("./Router/article");
app.use('/article', article_router);

// 错误中间件
app.use(function (err, req, res, next) {
    // 表单数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);
    if (err.name === "UnauthorizedError") {
        return res.cc("无效的token")
    }
    // 未知错误
    res.cc(err)
})


app.listen(80, () => {
    console.log("http://127.0.0.1");
})