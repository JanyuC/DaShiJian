// 导入数据库
const db = require("../db/index");

//获取文章分类
module.exports.getsort = (req, res) => {
    // 查询未被删除的文章分类
    const sql = 'select * from ev_article_sort where is_delete=0';
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length <= 0) {
            return res.cc("获取文章失败")
        }
        res.send({
            status: 0,
            msg: "获取文章成功！",
            data: result
        })
    })
}

// 新增文章分类
module.exports.addsort = (req, res) => {
    // 查询分类是否存在
    const sqlstr = 'select * from ev_article_sort where name=? or alias=?';
    db.query(sqlstr, [req.body.name, req.body.alias], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length !== 0) {
            return res.cc("分类名称或别名已存在")
        }
        // 不存在就插入分类
        const sql = 'insert into ev_article_sort (name,alias) values(?,?)';
        db.query(sql, [req.body.name, req.body.alias], (err, result) => {
            if (err) {
                return res.cc(err)
            }
            if (result.affectedRows !== 1) {
                return res.cc("添加文章分类失败");
            }
            res.send({
                status: 0,
                msg: "添加成功"
            })
        })
    })

}

//根据id删除文章分类
module.exports.delsort = (req, res) => {
    const sql = 'update ev_article_sort set is_delete=1 where id=?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.affectedRows !== 1) {
            res.cc("删除失败")
        }
        res.cc("删除分类成功", 0)
    })
}

//根据id获取文章分类数据
module.exports.getsortById = (req, res) => {
    const sql = 'select * from ev_article_sort where id=?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.length !== 1) return res.cc('获取文章分类数据失败！')
        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: result[0],
        })
    })
}

//根据id更新文章分类数据
module.exports.updatesortById = (req, res) => {
    // 查询更新后的分类名称或别名是否存在
    const sql = 'select * from ev_article_sort where id!=? and (name=? or alias=?)';
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length !== 0) {
            return res.cc("分类名称或别名已存在")
        }
        // 分类存在，更新数据
        const sqlstr = 'update ev_article_sort set ? where id=?';
        db.query(sqlstr, [req.body, req.body.id], (err, result) => {
            if (err) {
                return res.cc(err)
            }
            if (result.affectedRows !== 1) {
                return res.cc("更新失败")
            }
            res.cc("更新分类成功", 0)
        })
    })
}