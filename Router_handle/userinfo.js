// 调用数据库
const db = require("../db/index");

// 密码加密
const bcrypt = require("bcryptjs")

// 获取用户信息
module.exports.getuerinfo = (req, res) => {
    const sqlstr = 'select id, username, nickname, email, user_pic from ev_users where id=?'
    //token数据会挂载在req.use上
    db.query(sqlstr, req.user.id, (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.length !== 1) {
            return res.cc("获取用户信息失败")
        }
        res.send({
            status: 0,
            msg: '用户信息获取成功',
            data: result[0]
        })
    })
}

//更新消息
module.exports.updateinfo = (req, res) => {
    const sql = 'update ev_users set ? where id=?';
    // console.log(req.user);   token的信息用req.user接收
    // 更新当前登录用户的基本信息
    db.query(sql, [req.body, req.user.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            status: 0,
            msg: '用户信息更新成功',
            data: result[0]
        })
    })
}

// 重置密码
module.exports.updatepwd = (req, res) => {
    //查询用户是否存在  如果不进行这一步无法进行旧密码验证
    const sqlstr = 'select * from ev_users where id=?'
    db.query(sqlstr, req.user.id, (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.length !== 1) {
            return res.cc('用户不存在')
        }
        // 检验旧密码是否匹配
        const Result = bcrypt.compareSync(req.body.oldpwd, result[0].password);
        if (!Result) {
            return res.cc("原密码错误");
        }
        // 修改密码
        const sql = 'update ev_users set password=? where id=?';
        // 对新密码加密
        const newPwd = bcrypt.hashSync(req.body.newpwd, 10)
        db.query(sql, [newPwd, req.user.id], (err, result) => {
            if (err) {
                return res.cc(err)
            }
            // SQL 语句执行成功，但是影响行数不等于 1
            if (result.affectedRows !== 1) return res.cc('更新密码失败！');
            res.send({
                status: 0,
                msg: '修改密码成功'
            })
        })
    })

}

// 更新头像
module.exports.updatepic = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?';
    db.query(sql, [req.body.userpic, req.user.id], (err, result) => {
        if (err) {
            return res.cc(err);
        }
        if (result.affectedRows !== 1) {
            return res.cc("更新头像失败");
        }
        res.cc("更新头像成功", 0)
    })
}