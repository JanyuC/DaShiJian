const express = require("express");
const router = express.Router();

//post解析表单 multupart/form-data
const multer = require("multer");

//导入处理路径模块
const path = require("path");
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

const article_router = require('../Router_handle/article');

//验证规则
const expressjoi = require("@escook/express-joi");
const { publish_schema, delsort_schema, updatesrticle_schema } = require("../schema/sch")

//发表文章
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/publish', upload.single('cover_img'), expressjoi(publish_schema), article_router.publish_article);

//获取文章
router.get('/getarticle', article_router.getarticle);

//根据id删除文章数据
router.get('/delarticle/:id', expressjoi(delsort_schema), article_router.delarticle)

//根据id获取文章
router.get('/getarticleById/:id', expressjoi(delsort_schema), article_router.getarticleById);

// 根据id更新文章
router.post('/updatearticle', upload.single('cover_img'), expressjoi(updatesrticle_schema), article_router.updatearticle);

module.exports = router