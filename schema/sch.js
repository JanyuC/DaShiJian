// 定义规则
const joi = require("joi");

/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern(正则表达式) 值必须符合正则表达式的规则
* integer()整数
*/

//1.注册表单验证规则
// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
module.exports.schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password,
    },
}

//2.更新基本信息验证规则
// 定义 id, nickname, emial 的验证规则
const nickname = joi.string().required()
const email = joi.string().email().required()
module.exports.updateinfo_schema = {
    body: {
        nickname,
        email
    }
}

//3.修改密码验证规则
module.exports.pwd_schema = {
    body: {
        oldpwd: password,
        // joi.ref()表示值保持一致
        // joi.not()表示两个值不能相等
        // .concat(password)表示合并验证规则
        newpwd: joi.not(joi.ref('oldpwd')).concat(password)
    }

}

//4.更新头像验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const userpic = joi.string().dataUri().required()
module.exports.pic_schema = {
    body: {
        userpic
    }
}


// 5.添加文章分类
const name = joi.string().required();
const alias = joi.string().alphanum().required();
module.exports.addsort_schema = {
    body: {
        name,
        alias
    }
}

//6.根据id删除文章分类

const id = joi.number().integer().min(1).required();
module.exports.delsort_schema = {
    params: {
        id
    }
}

//7.根据id更新文章分类
module.exports.updatesort_schema = {
    body: {
        name,
        alias,
        id
    }

}

//发表文章
const cate_id = joi.number().integer().min(1).required();
const title = joi.string().required();
const content = joi.string().required();
const state = joi.string().valid('已发布', '草稿').required();
module.exports.publish_schema = {
    body: {
        cate_id,
        title,
        content,
        state
    }
}

//根据id更改文章
module.exports.updatesrticle_schema = {
    body: {
        id,
        title,
        content,
        state
    }
}