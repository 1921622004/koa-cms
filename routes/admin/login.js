const Router = require('koa-router')();

Router.get('/',async (ctx,next) => {
    await ctx.render('admin/login');
})

module.exports = Router.routes();