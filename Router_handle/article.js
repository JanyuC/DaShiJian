const db = require("../db/index")

// 发表文章
module.exports.publish_article = (req, res) => {
    //判断是否提交图片
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面为必选项')
    }
    // 导入处理路径的 path 核心模块
    const path = require('path')
    //插入的数据对象
    const articleinfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.originalname),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }

    const sql = 'insert into ev_article set ?';
    db.query(sql, articleinfo, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc("发表文章失败");
        res.cc("文章发表成功！", 0)
    })
}

//获得文章列表
module.exports.getarticle = (req, res) => {
    const sql = 'select * from ev_article';
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length <= 0) {
            res.cc("获取文章失败")
        }
        res.send({
            status: 0,
            msg: '获取文章成功',
            data: result
        })
    })
}

//根据id删除文章数据
module.exports.delarticle = (req, res) => {
    const sql = 'select * from ev_article where id=?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length <= 0) {
            return res.cc("此文章不存在")
        }
        const sqlstr = 'delete from ev_article where id=?';
        db.query(sqlstr, req.params.id, (err, result) => {
            if (err) {
                return res.cc(err)
            }
            if (result.affectedRows !== 1) {
                return res.cc("删除文章失败")
            }
            res.cc("删除成功!", 0)
        })
    })
}

// 根据id获取文章
module.exports.getarticleById = (req, res) => {
    const sql = 'select * from ev_article where id=?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length <= 0) {
            return res.cc("此文章不存在");
        }
        res.send({
            status: 0,
            msg: '查询成功',
            data: result
        })
    })
}

// 根据id更新文章信息
module.exports.updatearticle = (req, res) => {

    //判断是否提交图片
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面为必选项')
    }
    // 导入处理路径的 path 核心模块
    const path = require('path')//把更新的数据放入对象里
    const articleinfo = {
        // id,title、content、state
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.originalname),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    const sql = 'select * from ev_article where id=?';
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length <= 0) {
            return res.cc("此文章不存在");
        }
        const sqlstr = 'update ev_article set ? where id=?';
        db.query(sqlstr, [articleinfo, req.body.id], (req, result) => {
            if (err) {
                return res.cc(err);
            }
            if (result.affectedRows !== 1) {
                return res.cc("更新失败");
            }

            res.cc("文章修改成功", 0)
        })
    })
}
