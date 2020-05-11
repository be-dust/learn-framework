# vue-router流程梳理
1. Vue调用vue-router的install方法，这个install方法内部做了以下几件事：
    1. 给每个Vue组件混入了一个beforeCreate钩子。
    2. 给Vue.prototype（注意不是Vue实例）上定义了两个属性路由$route、路由实例$router，这样每一个Vue组件实例都可以访问到他们。
    3. 定义了两个全局组件 <router-link>和<router-view>。
2. new VueRouter()创建路由实例router：
    1. 创建路由方案
    2. 创建路由映射表
3. new Vue()，这个就是根实例，调用beforeCreate钩子就会初始化路由：
    1. 第一次调用history.transitionTo方法，并根据选择的路由方案来监听对应的事件，这是路由的一个核心方法
    2. 之后，每次地址栏发生变化，都会再调用history.transitionTo方法。

## 1. 为什么要混入beforeCreate钩子？
```js
Vue.mixin({
	beforeCreate() {
		// 判断是不是根实例, 只有根实例上才会有router属性
		if (this.$options.router) {
			this._routerRoot = this;// 保存根实例, 就是new Vue得到的实例
			this._router = this.$options.router;

			this._router.init(this);// 重点 路由的初始化
		} else {
			// 子组件上都有一个_routerRoot属性可以获取到最顶层的根实例
			this._routerRoot = this.$parent && this.$parent._routerRoot;
		}
	}
})
```
我们给每个组件的beforeCreate都混入这么一段逻辑，为的就是能够在每一个组件中获取到路由实例router， 加上下面的代码:
```js
Object.defineProperty(Vue.prototype, '$router', {
	get() {
		return this._routerRoot._router;
	}
});
```
使用Object.defineProperty其实就是实现了一层代理，这样我们在任何一个组件中就可以使用
```js
this.$router
```
来访问路由实例了。

上面我们说了类似的还有一个 `$route`属性, 这个我们放在下面讲。
## 2. 路由方案
vue-router中提供了三种路由方案：
1. hash模式, 无需重载页面，监听hashchange事件
2. history模式， 利用 history.pushState API 来完成 URL 跳转而无须重新加载页面， 监听popState事件。
3. abstract模式，非浏览器环境下使用。
## 3. 路由映射表
new一个路由实例时会创建一个路由映射表，这个映射表就是把用户传入的路由配置格式化后的结果。

举一个例子:
```js
const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import( /* webpackChunkName: "about" */ '../views/About.vue'),
  children: [
    {
      path: 'a',
      component: {
        render(h) { return <h1> this is about / a </h1>}
      }
    },
    {
        path: 'b',
        component: { 
          render(h) { return <h1> this is about / b </h1> }
        }
    }
  ]
}]

```
格式化之后的路由映射表就是下面这个样子:
```
{
    "/": {
        "path": "/",
        "component": Home组件,
        "parent": undefined
    },
    "/about": {
        "path": "/about"
        "component": About组件,
        "parent": undefined
    },
    "/about/a": {
        "path": "/about/a",
        "component": 组件A,
        "parent":  {
            "path": "/about"
            "component": About组件,
            "parent": undefined
        },
    },
    "/about/b": {
        "path": "/about/b",
        "component": 组件B,
        "parent":  {
            "path": "/about"
            "component": About组件,
            "parent": undefined
        },
    }
}
```
这里涉及了一个vue-router重要的一个概念 `record` , 
上面的每一条数据就是一条记录，这个需要牢记要和路径location区分开。

看看具体代码实现吧
```js
export default function createRouteMap(routes, oldPathList, oldPathMap) {
	let pathList = oldPathList || [];
	let pathMap = oldPathMap || Object.create(null);
	// 数组的扁平化
	routes.forEach(route => {
		addRouteRecord(route, pathList, pathMap);
	});
	console.log('pathMap', pathMap);
	return {
		pathList,
		pathMap
	}
}


function addRouteRecord(route, pathList, pathMap, parent) {
	// 记录父子关系
	let path = parent ? parent.path + '/' + route.path : route.path;
	let record = {
		path,
		component: route.component,
		// todo...
		parent
	}
	if( !pathMap[path]) {
		pathList.push(path);
		pathMap[path] = record;
	}
	if (route.children) {
		route.children.forEach(route => {
			addRouteRecord(route, pathList, pathMap, record);
		});
	}
}
```
还是递归，最终把用户传入的树形结构配置拍平。

addRouteRecord方法有四个参数:
1. route 当前某条用户写的配置
2. pathList 存放所有的路径， 是一个数组
3. pathMap 路由映射表，是一个对象
4. parent 父记录

需要注意的是pathList和pathMap都是引用类型，因此递归的过程中处理的都是一开始定义好的。

## 4. history.transition方法
```
transitionTo(location, callback) {
	let r = this.router.match(location);
	
	if (location == this.current.path && r.matched.length === this.current.matched.length) {
		return;
	}

	callback && callback();// 监听hash变化
	
	// 更改路径之后，需要先执行钩子
	let queue = this.router.beforeEachs;
	const iterator = (hook, next) => {
		// 调用用户传入的方法， 需要用户手动调用next方法
		hook(this.current, r, next);

	}
	runQueue(queue, iterator, () => {
		this.updateRoute(r);
	});
	
}
```
主要流程是：
### 1. 使用当前路径匹配记录

```js
let r = this.router.match(location);
```
这里用到了router的一个match方法，它接收一个路径location返回一个
```js
{path: '', matched: []}
```
格式的数据。

这里也涉及了一个核心的方法：
```js
export function createRoute(record, location) {
	let res = []; 
	if (record) {
		while(record) {
			res.unshift(record);
			record = record.parent;
		}
	} 
	return {
		...location,
		matched: res
	}
}
```
比如about/a这条路径，它应该对应两条记录分别是about 和 about/a， 这两条都要作为匹配的结果存起来， 之后的多级渲染<router-view>组件会用到。

### 2. 依次执行钩子函数
还记得全局前置守卫beforeEach吗？

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。

我们是这么使用的
```js
router.beforeEach((from, to, next) => {
  console.log(1);
  setTimeout(() => {
    next();
  }, 1000);
});
router.beforeEach((from, to, next) => {
  console.log(2);
  setTimeout(() => {
    next();
  }, 1000);
});

```
打印1，1s之后打印2。只有用户手动调用next方法才会走到下个逻辑， 是不是特别像generator中的next呢？
```
function runQueue(queue, iterator, callback) {
	function step(index) {
		if (index === queue.length) return callback();
		let hook = queue[index];// 钩子函数
		iterator(hook, ()=>step(index+1));
	}
	step(0);
}
```
runQueue有三个参数：
1. queue 目标任务队列
2. 迭代函数
3. 所有任务执行完之后的回调

我们再回顾下transitionTo方法中的这段代码
```js
let queue = this.router.beforeEachs;
const iterator = (hook, next) => {
	// 调用用户传入的方法， 需要用户手动调用next方法
	hook(this.current, r, next);

}
runQueue(queue, iterator, () => {
	this.updateRoute(r);
});
```
1. 先拿到所有的钩子
2. 然后定义了一个迭代函数，这个迭代函数接收两个参数：
    1. hook就是用户传入的钩子函数
    2. next函数
3. 调用runQueue方法，在其内部，调用iterator函数。

当所有钩子执行完之后下一步就是更新路由了。
```js
this.updateRoute(r);
```
### 3. 更新当前路由
updateRoute方法是类history上的一个方法
```
updateRoute(r) {
	this.current = r;
	this.cb && this.cb(r);//告诉_route属性更新，更新后视图会重新渲染
}
```
这里的r就是最新的路由, cb就是路由更新函数。

cb:
```js
(route) => {
	app._route = route;
}
```
而要更新的这个路由就是我们起初在install方法中定义的_route属性了。

我们在beforeCreate中加上_route的定义
```js
Vue.mixin({
	beforeCreate() {
		if (this.$options.router) {
		    ...
			Vue.util.defineReactive(this, '_route', this._router.history.current);
		} else {
		    ...
		}
	}
})
```
配合上
```js
Object.defineProperty(Vue.prototype, '$router', {
	get() {
		return this._routerRoot._router;
	}
});
```
这样一来，当路由变化之后，_route属性就发生变化，那么接下来视图怎么就更新了呢？组件什么时候对_route做了依赖收集？
## 5. 路由变化，如何触发视图更新？
我们知道，视图的更新需要两个条件：
1. 数据是响应式的
2. 渲染watcher对这个数据做了依赖收集

上面我们已经对_route也就是$route做了响应化处理，那么什么时候对它进行依赖收集了呢？

那就要看看<router-view>组件是怎么实现的了。

```
export default {
	functional: true,
	render(h, {parent, data}) {
		let route = parent.$route;
		let depth = 0;// 组件深度
		while(parent) {
            // 如果父组件有router-view并且已经渲染过了，则深度+1
			if (parent.$vnode && parent.$vnode.data.routerView) {
				depth++;
			} 
			parent = parent.$parent;
		}
		data.routerView = true;// <router-view>渲染之后就给这个router-view的data上加一个属性

        let record = route.matched[depth]
		if (!record) {
			return h();// 返回一个空的节点
		}
		return h(record.component, data);
	}
}

```

vue-router把<router-view>组件做成了一个函数式组件，作为函数组件，它没有状态，没有data, props，也没有this，不能实例化，开销比较小，当然性能就好。

我们知道组件渲染的顺序是从父到子，因此父组件中的<router-view>会首先渲染, 父组件的默认深度是0，直接拿到第一条记录的组件渲染即可，接下来是子组件，需要先找到它的父级，然后是爷爷级...确定深度，然后找到对应记录的组件渲染。

<router-view>组件中使用到了$route属性，这样就收集了依赖。因此就可以更新视图了。

## 4. 刚打开页面时地址栏的 #/ 是从哪里来的？如果不想要这个怎么实现？

```
function ensureSlash(params) {
	if (window.location.hash) {
		return;
	}
	window.location.hash = '/';
}
```
这是默认使用hash模式下做的一个处理，保证页面打开时路径就有一个默认值, 如果我们不想用 # 这种，就可以使用history模式。


