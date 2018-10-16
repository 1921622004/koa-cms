const Koa = require('koa'),
  BodyParser = require('koa-bodyparser'),
  router = require('koa-router')(),
  render = require('koa-art-template'),
  path = require('path'),
  static = require('koa-static'),
  session = require('koa-session'),
  { ObjectId } = require('./Schema')

// session config
const SessionConfig = {
  key: 'userinfo',
  /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true,
  /** (boolean) automatically commit headers (default true) */
  overwrite: true,
  /** (boolean) can overwrite or not (default true) */
  httpOnly: true,
  /** (boolean) httpOnly or not (default true) */
  signed: true,
  /** (boolean) signed or not (default true) */
  rolling: false,
  /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false,
}


// app实例化
const app = new Koa();
app.keys = ['awesome'];

app.use(session(SessionConfig, app));
app.use(BodyParser());

// 配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV != 'production',
  dateFormat: dateFormat = value => {
    console.log(value);
    return ObjectId(value).valueOf()
  }
})

// 配置静态资源
app.use(static(__dirname + '/public'))


// 引入对应路由
const index = require('./routes/index');
const admin = require('./routes/admin');
const api = require('./routes/api');

router.use('/admin', admin)
  .use('/api', api)
  .use(index);

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);