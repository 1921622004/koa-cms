const Router = require('koa-router')();
const {
    UserDAO,
    ObjectId
} = require('../../Schema');

Router.use(async (ctx, next) => {
    ctx.state.GLOBAL_INFO = {
        userName: ctx.session.userinfo
    };
    await next();
})

Router.param('id', (id, ctx, next) => {
    ctx.id = id;
    return next()
})

Router.get('/add', async ctx => {
    await ctx.render('admin/user/add');
})

Router.get('/list', async ctx => {
    const list = await UserDAO.queryUser({});
    ctx.state.managerList = list;
    await ctx.render('admin/user/list');
})

Router.get('/edit', async ctx => {
    await ctx.render('admin/user/edit');
})

Router.post('/updateOne', async ctx => {
    const {
        userName
    } = ctx.request.body;
    const data = await UserDAO.queryUser({
        userName
    });
    if (data.length > 0) {
        let id = data[0]['_id'];
        let status = data[0]['status'];
        const res = await UserDAO.updateUser({
            '_id': ObjectId(id)
        }, {
            'status': status ? 0 : 1
        });
        if (res) {
            ctx.body = {
                code: 0,
                success: true,
                message: '修改成功'
            }
        } else {
            ctx.body = {
                code: 1,
                success: false,
                message: '修改失败'
            }
        }
    } else {
        ctx.body = {
            code: 1,
            success: false,
            message: '未找到用户'
        }
    }
});

Router.post('/add', async ctx => {
    const {
        userName,
        password,
        managerId
    } = ctx.request.body;
    if (managerId) {
        const modifyRes = await UserDAO.updateUser({
            _id: managerId
        }, {
            userName,
            password
        });
        if (!modifyRes) {
            ctx.body = {
                code: 1,
                message: '修改失败',
                success: false
            }
        } else {
            ctx.body = {
                code: 0,
                success: true,
                message: '修改成功'
            }
        }
    } else {
        const addRes = await UserDAO.insertOne({
            userName,
            password,
            status: 1
        });
        if (addRes) {
            ctx.body = {
                code: 0,
                success: true,
                message: '新增成功'
            }
        } else {
            ctx.body = {
                code: 1,
                success: false,
                message: '新增失败'
            }
        }
    }

})

Router.get('/delete/:id', async ctx => {
    const res = await UserDAO.deleteOne(ctx.id);
    if (res) {
        ctx.body = {
            code: 0,
            success: true,
            message: '删除成功'
        }
    } else {
        ctx.body = {
            code: 1,
            success: false,
            message: '删除失败'
        }
    }
})

Router.get('/edit/:id', async ctx => {
    const id = ctx.id;
    const currentManager = await UserDAO.findById(id);
    ctx.state.curM = currentManager;
    await ctx.render('admin/user/edit');
})


module.exports = Router.routes();