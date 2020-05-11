import createApp from './app';

// 服务端渲染要求打包后的结果需要返回一个函数
// 服务端稍后会调用这个函数并传递一些参数到这个函数中

// 需要把跳转路径传递过来
// export default (context) => {
//     console.log(context);
//     let {app, router} = createApp();
//     router.push(context.url);// 服务端渲染时先让路由跳转到当前客户端请求的路径，这样的话对应的<router-view>就有内容,渲染的时候就不会空。渲染的时候页面有啥就渲染啥，必须先都准备齐活了才行
//     return app;// 先跳转路由，然后再返回实例
// }

export default (context) => {
    // 返回一个promise
    return new Promise((resolve, reject) => {
        let {app, router, store} = createApp();
        router.push(context.url);
        // 异步组件 需要等待路由中的钩子函数执行完毕后才执行渲染逻辑
        router.onReady(() => {
            // 不能无脑返回app，还需要看看前端有没有这个路由
            let matchComponents = router.getMatchedComponents();// 查询路由匹配的组件

            if (!matchComponents.length) {
                return reject({code: 404});// 如果前端没有配置404的路由，那么后端需要配置404页面
            }
            // 这个组件里可能会有asyncData方法
            Promise.all(matchComponents.map(comp => {
                return comp.asyncData && comp.asyncData(store)// 这里可能更改了状态，但是因为是服务端渲染只会根据默认的状态来渲染字符串，所以server.html查看网页源代码就只能看到最初的状态
            })).then(() => {
                // 注意是在5s之后才会渲染页面,因为是请求完成之后才返回的app, 这样就不会有白页的情况
                // 默认渲染时会给window加一个属性window._initState_
                // 将上面修改后的状态放在的当前的上下文上。这个时候页面会显示name: zx, 但是马上闪一下消失了,这是因为浏览器页面加载的时候，前端的代码就执行了，而前端的store中state.name还是空的，所以就有了闪一下的问题, 还需要把上面获取到的状态更新到默认的状态
                context.state = store.state;
                resolve(app);
            }, err => {
                reject(err);
            });
        }, reject);
    });
}