const express = require("express");
const router = express.Router();

const expressjoi = require("@escook/express-joi");

// 导入用户信息的路由操作
const userinfo = require("../Router_handle/userinfo");

// 获取用户基本信息
router.get('/userinfo', userinfo.getuerinfo);

//更新用户信息
const { updateinfo_schema, pwd_schema, pic_schema } = require("../schema/sch");

router.post('/updateinfo', expressjoi(updateinfo_schema), userinfo.updateinfo);

// 重置密码
router.post('/updatepwd', expressjoi(pwd_schema), userinfo.updatepwd);

// 更新用户头像
router.post('/updatepic', expressjoi(pic_schema), userinfo.updatepic);


module.exports = router;