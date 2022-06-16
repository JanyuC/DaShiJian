const express = require('express');
const router = express.Router();

const articlesort_router = require("../Router_handle/acticlesort");

// 验证规则
const expressjoi = require("@escook/express-joi");
const { addsort_schema, delsort_schema, updatesort_schema } = require("../schema/sch")

//获取文章分类
router.get('/getsort', articlesort_router.getsort);
//新增文章分类
router.post('/addsort', expressjoi(addsort_schema), articlesort_router.addsort);
// 根据id删除文章分类
router.get('/delsort/:id', expressjoi(delsort_schema), articlesort_router.delsort);
// 根据id获取文章分类信息
router.get('/getsortById/:id', expressjoi(delsort_schema), articlesort_router.getsortById);
// 根据id更新文章分类
router.post('/updatesortById', expressjoi(updatesort_schema), articlesort_router.updatesortById)

module.exports = router