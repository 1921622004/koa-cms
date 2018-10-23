const router = require('koa-router')();
const { ArticleDAO, ObjectId } = require('../../Schema');

router.use(async (ctx,next) => {
    ctx.state.GLOBAL_INFO = {
        userName: ctx.session.userinfo
    };
    await next()
})

router.get('/list',async ctx => {
    let listRes = await ArticleDAO.find({});
    ctx.state.list = listRes;
    console.log(listRes);
    
    await ctx.render('admin/article/list')
})

module.exports = router.routes()