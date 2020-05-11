// node 需要commonjs规范
const koa = require('koa');
const Router = require('koa-router');
const app = new koa();
const router = new Router();// 产生一个路由系统

const Vue = require('vue');
const vm = new Vue({
    data() {
        return { name: 'zx', age: 10}
    },
    template: `<div>
        <p>{{name}}</p>
        <span>{{age}}</span>
    </div>`
});
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf8');

const VueServerRenderer = require('vue-server-renderer');
const render = VueServerRenderer.createRenderer({
    template // 指定模板, 模板中的<!--vue-ssr-outlet-->是必须的，这就是模板
});// 创建一个渲染器

router.get('/', async (ctx) => {// 访问/ 请求方法是get
    ctx.body = await render.renderToString(vm);// 渲染的结果只是一个字符串，没有html、body等
});

app.use(router.routes());
app.listen(3000);

// 可以使用code runner建立服务， 每次修改服务端代码都需要重启服务器 
// 可以使用nodemon 启用热更新  npm install nodemon -g nodemon back.js