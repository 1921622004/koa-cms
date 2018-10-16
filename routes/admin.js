const router = require('koa-router')();
const manager = require('./admin/manager');
const login = require('./admin/login');
const svgCaptcha = require('svg-captcha');

const {
    UserDAO,
    ObjectId
} = require('../Schema');

router.use(async (ctx, next) => {
    if (ctx.request.path === '/admin/login' ||
        ctx.request.path === '/admin/loginPost' ||
        ctx.request.path === '/admin/code') {
        await next()
    } else {
        if (ctx.session.userinfo) {
            await next();
        } else {
            ctx.redirect('/admin/login');
        }
    }
});
router.post('/loginPost', async (ctx, next) => {
    const {
        userName,
        password,
        code
    } = ctx.request.body;
    if (!userName || !password || !code) {
        ctx.body = '不能为空';
        return;
    };
    if (code.toLowerCase() !== ctx.session.captcha.toLowerCase()) {
        ctx.body = '验证码错误';
        return;
    };
    let res = await UserDAO.queryUser({
        userName,
        password: Number(password)
    });
    if (res.length === 0) {
        ctx.body = '当前用户不存在'
    } else {
        let id = res[0]['_id'];
        const updateResult = await UserDAO.updateUser({'_id':ObjectId(id)},{'lastLoginTime':new Date()});
        if(updateResult){
            ctx.session.userinfo = userName;
            ctx.redirect('/admin/manager/list');
        } else {
            ctx.body = {
                code:1,
                success:false,
                message:'更新失败'
            }
        }
        
    }
})

router.get('/code', async ctx => {
    let captcha = svgCaptcha.create({
        size: 4,
        background: '#a399e3',
        width: 120,
        height: 32
    });
    ctx.session.captcha = captcha.text;
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
})

router.get('/logout', async ctx => {
    ctx.session.userinfo = null;
    ctx.redirect('/admin/manager/list');
})
router.use('/login', login);
router.use('/manager', manager);

module.exports = router.routes();