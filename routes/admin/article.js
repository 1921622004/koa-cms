const router = require('koa-router')();
const { UserDAO, ObjectId } = require('../../Schema');

router.get('/list',async ctx => {
    await ctx.render('admin/articlecate/index');
})

module.exports = router.routes()