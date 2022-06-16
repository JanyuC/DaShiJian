// 调用数据库
const db = require('../db/index')
// 密码加密
const bcrypt = require("bcryptjs");
//生成token
const jwt = require("jsonwebtoken");


// 注册响应操作
module.exports.user_reg = (req, res) => {
    // 1.检验表单数据是否合法
    const userinfo = req.body;  //输入的数据传递给userinfo
    // 判断用户名或密码是否为空 已用表单验证中间件实现
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 201,
    //         msg: "用户名或密码为空"
    //     })
    // }

    // 2.检验用户名是否被占用
    // 查询语句 ? 占位符
    const sqlstr = "SELECT * FROM ev_users WHERE username=?"
    db.query(sqlstr, userinfo.username, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length > 0) {
            return res.cc("用户名已存在")
        }
        //3.对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        //4.插入新用户
        const sql = "INSERT INTO ev_users SET ?";
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, result) => {
            if (err) {
                return res.cc(err)
            }
            // 影响条数不为一
            if (result.affectedRows !== 1) {
                return res.cc("注册用户失败,请稍后再试")
            }
            res.cc("注册成功", 0)
        })
    })



}

// 登录响应操作
module.exports.user_login = (req, res) => {
    // res.send("login OK");
    const userinfo = req.body;
    // 查询用户数据
    db.query('SELECT * FROM ev_users WHERE username =?', userinfo.username, (err, result) => {
        if (err) {
            return res.cc(err);
        }
        // 1.查询条数不等于1
        if (result.length !== 1) {
            return res.cc("登陆失败");
        }
        // 2.判断用户密码是否正确
        // res.send(result);
        // 用bcrypt.compareSync判断密码是否一致 返回布尔值
        const compareResult = bcrypt.compareSync(userinfo.password, result[0].password);
        if (!compareResult) {
            return res.cc("密码错误!")
        }
        // 3.判断成功,为了保护密码安全,生成一个token返回给客户端解密
        // 导入密钥
        const secretKey = require("../secr/secr");
        // 密码和头像不能放进token,以防泄露
        const secretstr = { ...result[0], password: ' ', user_pic: '' }
        const tokenstr = jwt.sign(secretstr, secretKey, { expiresIn: '10h' });
        res.send({
            status: 0,
            msg: '登陆成功',
            // 为了方便客户端解密,服务器直接将Bearer拼接到token
            token: 'Bearer ' + tokenstr
        })
    })
}