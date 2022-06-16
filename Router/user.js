// 路由模块
const express = require("express");
const router = express.Router();

// 为了确保路由模块的纯粹性，我们将路由模块的处理函数分离出去
const router_handle = require("../Router_handle/user");

// 验证表单中间件
const expressJoi = require("@escook/express-joi");
// 导入需要验证的验证规则对象
const { schema } = require('../schema/sch');


// 注册
// 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件
router.post('/register', expressJoi(schema), router_handle.user_reg)

// 登录
router.post('/login', expressJoi(schema), router_handle.user_login)


module.exports = router