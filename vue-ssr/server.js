const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const static = require('koa-static');
const ServerRender = require('vue-server-renderer');

let app = new Koa();
let router = new Router();

// 可以采用字符串的方式
// let ServerBundle
//  = fs.readFileSync(path.resolve(__dirname, 'dist/server.bundle.js'), 'utf8');

// 使用json
let ServerBundle = require('./dist/vue-ssr-server-bundle.json');

// 获取模板
let template
    = fs.readFileSync(path.resolve(__dirname, 'dist/server.html'), 'utf8');

// 创建渲染器
// let render = ServerRender.createBundleRenderer(ServerBundle, {// createBundleRenderer方法接收的是打包后的结果，参数类型是对象或者字符串
//     template
// })

let clientManifest = require('./dist/vue-ssr-client-manifest.json');
let render = ServerRender.createBundleRenderer(ServerBundle, {
    template,
    clientManifest// 这样的话server.html就会自动引用客户端打包后的结果， 并且不需要考虑客户端打包后的js的命名不同的问题
})

router.get('/', async ctx => {
    // ctx.body = await render.renderToString();// 调用 render.renderToString()就会执行server-entry.js中导出的那个函数, 这个函数就放在创建渲染器时传进来的ServerBundle中。需要注意的是这种写法无法解析css
    
    console.log(ctx.path);
    ctx.body = await new Promise((resolve, reject) => {// 解析css 必须写成回调的方式
        render.renderToString({url: ctx.path}, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                resolve(data); 
            }
        });
    });
    // 样式有了，但是点击按钮没有反应，表明没有js功能，因为server-entry.js入口中没有写#app，这样就没有挂载，元素上面就不会绑定事件

    // server.html引用client.bundle.js, 这样的话就会向服务器发送请求，需要使用koa-static提供一个静态资源服务，把目录设置为dist

    // 有了client.bundle.js之后点击按钮还是没有生效，为什么呢？这是因为我们在client-entry.js中把实例app挂载到了#app中，但是server.html中压根就没有#app这个元素，我们可以给App.vue的根元素添加属性id="app"来解决。

    // server.html中引入client.bundle.js会不会重新渲染页面呢？这个vue内部做了处理，如果是服务端渲染就不再进行渲染。

    // 服务端渲染的页面使用的是打包后的文件，包括服务端的server.bundle.js、server.html以及客户端的client.bundle.js，这样我们就需要修改源代码之后能够
    // 1. 自动打包，页面自动更新
    // 2. server.html中不再手动引用client.bundle.js

    // 只有首屏是服务端渲染
});

router.get('*', async ctx => {
    console.log(ctx.path);
    try {
        ctx.body = await new Promise((resolve, reject) => {
            render.renderToString({ url: ctx.url }, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(data);
                    resolve(data);
                }
            })
        });
    } catch (e) {
        // console.log(ctx.path);
        // console.log(e);
        ctx.body = 'page not found';
    }
});

app.use(static(path.resolve(__dirname, 'dist')))// 告诉静态页以哪个页面来显示
app.use(router.routes());
app.listen(3000);