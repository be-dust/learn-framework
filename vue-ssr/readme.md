
## 什么是服务端渲染？
简单的说就是在服务端把数据请求完，拼装好页面返回给前端
## 哪里需要服务端渲染?
我们说的服务端渲染其实都是针对单页应用的，另外还需要主要，服务端渲染只是指首屏，其他页面仍然走的是前端逻辑
## 为什么需要服务端渲染?
对于单页应用，存在两个问题那就是：
1. 我们的页面只有
```
<div id="app"></div>
<script src="bundle.js"></script>
```
放在搜索引擎前的也只有这些东西，相当于什么都没有，非常不利于SEO
2. 因为我们所有的代码都在bundle.js中，这个文件如果很大就会造成加载时间过长，这个时候页面就会是一片空白，另外如果首屏内容需要依靠后台接口，当接口返回缓慢的情况下同样也会造成白屏的情况。

而服务端渲染因为返回给浏览器的就是已经拼接好的html字符串，浏览器直接渲染就好了,这样的话我们的页面就不再是空空一片也利于SEO。

服务端带来了这么多好处，当然也会有缺陷：
- 占用大量cpu和内存，当然是针对服务器的
- Vue的很多API不能用，比如声明周期只支持beforeCreate、created
- 学习成本，自不必说

## 基本配置
ssr官网链接 https://ssr.vuejs.org/#what-is-server-side-rendering-ssr

- webpack 核心，打包使用
- webpack-cli 命令行工具，解析命令行参数
- webpack-dev-server 在开发环境下提供一个开发环境，支持热更新
- webpack-merge


- babel-loader webpack和babel的一个桥梁, webpack通过babel-loader使用@babel/core
- @babel/core babel的核心
- @babel/preset-env 可以把高级语法转换成es5

- style-loader 不支持服务端渲染, 因此vue做了一个扩展，扩展之后就是vue-style-loader,用来解析样式插入到页面中
- css-loader 

- vue
- vue-router
- vuex
- vue-loader vue和webpack之间的桥梁, webpack通过vue-loader使用vue-template-compiler
- vue-template-compiler 编译.vue文件,需要和Vue版本保持一致
- vue-server-renderer 服务端渲染核心包，需要和Vue版本保持一致

- koa
- koa-router 后端路由
- koa-static 指定后端返回的静态页面需要的静态资源目录

- html-webpack-plugin


## 服务端渲染不支持mounted钩子，那么如果首屏依赖于后端接口的话怎么去获取数据呢？
你可能会想到用beforeCreate、created这两个钩子，但是很遗憾这两个钩子只支持同步写法。官方提供了asyncData方法，返回的是一个promise：
1. 只会在服务端渲染并且是首屏时才会执行，如果走前端路由的话不会执行。
2. 只对页面级组件有效，就是某条路由相对应的那个组件, 这个没什么可纠结的，因为只有当路由跳转的时候才会执行router.onReady方法，然后内部会去取匹配的组件，如果匹配到了就去执行asyncData方法。


## 遇到的一个问题
如果根目录为xx.vue-ssr这种就报错，改为vue-ssr就好了

