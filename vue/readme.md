## 1. 双向绑定原理

当视图更新，数据就更新这个很简单，主要是针对一些表单提交，我们一般通过v-model来更新数据。

数据更新，视图就更新这个就比较复杂了。vue在初始化数据的时候会对数据进行数剧劫持进行响应化处理，在第一次渲染页面时会创建一个渲染watcher, 读取模板中的属性时会触发对应的getter，内部会把渲染watcher添加进自己的依赖里，当数据更新后会触发对应的setter，内部会通知渲染watcher去更新视图。这里面有几个关键点：
  
-  数据劫持 -> 响应化处理
-  创建watcher
-  依赖收集
-  派发更新即通知渲染watcher更新视图

## 2. 异步批量更新原理

其实就是nextTick的实现原理。
   
一句话总结就是把多次更新操作延迟到主线程所有的同步任务执行完之后。

比如我们写了下面这种代码
```js
setTimeout(() => {
	vm.msg = 'world';
	vm.lastName = '三';
	vm.firstName = '李';
}, 1000);

```
最终只会触发一次视图渲染，性能当然会提升。

先明确两点：
1. 渲染watcher，和watch中自定义的watcher会走到异步批量更新的逻辑中，计算属性watcher走的是另一套逻辑
2. 只有渲染watcher会更新视图

所以我们这里只说渲染watcher, ok, 那我们开始解析内部原理：

当我们修改属性值会通知渲染进行视图更新，这个时候并不会立即执行更新操作，而是会先把这些属性对应的渲染watcher都存在一个对列里，因为都是同一个渲染watcher，所以最后对列里只有一个渲染watcher(只考虑渲染watcher)，然后使用一个异步方法来执行对列中的渲染watcher的run方法也就是更新操作。关键就是这个异步方法，具体采用什么异步方法vue中有一个优先级的限制, Promise、MutationObserver、setImmediate、setTimeout, 前两个都是微任务，后两个都是宏任务，现代浏览器一般都支持Promise所以基本上都是采用的Promise，具体就是Promise的then方法，微任务会让更新操作更快执行。


## 3.数组依赖收集

对于数组，我们总结以下情况：

不能被检测的情况：
   1. 普通数组通过索引改变值不能被检测, 这种情形其实也可以实现但是当数组过大性能开销就会很大所以不建议这么做
   2. 数组长度变化不能被检测 

能被检测的情况
   1. 变异的数组方法可以被检测到
   2. 数组的项是对象的话会被检测
   3. 直接修改arr也会被检测到

假如我们传入的data是这个样子：
```js
data() {
	return {
		msg: 'hello',
		obj: {y: 1},
		arr: [1, 3, 4, {x: 1}],
	}
}
```
数据响应化处理
```js
export function defineReactive(data, key, value) {
	observe(value); 
	let dep = new Dep();
	Object.defineProperty(data, key, { 
		// 依赖收集
		get() {
			if (Dep.target) {
				dep.depend();
			}
			return value;
		},
		// 派发更新
		set(newValue) {
			if (newValue === value) return;
			observe(newValue);
			value = newValue;

			dep.notify();// 通知本属性所有的依赖进行更新
		}
	});
}
```
那么上面的这种写法我们已经对msg, obj, arr做了响应式处理,那么当执行下列操作
```js
vm.msg = 'xxx';
vm.obj = 'xxx';
vm.obj.y = 'xxx';
vm.arr = 'xxx';
vm.arr[3].x = 'xxx';
```
都会更新视图, 这是因为我们对
   1. data的每一个属性
   2. data下面的对象的每一个属性
   3. data下面的数组下面的对象的每一个属性都做了依赖收集

#### 数组本身如何进行依赖收集？
但是我们还差了一点那就是对数组本身进行依赖收集， 所以当我们使用数组的push、splice等方法时并不会触发视图更新, 需要进行特别的处理，那就是给数组上加一个___ob___属性。

#### 多维数组怎么依赖收集？

```js
data() {
	return {
		arr: [1, 3, 4, {x: 1}, [44]],
	}
}
```
首先我们明确一点：我们只能对属性进行数据劫持，从而这里最多只能对arr这个属性做数据劫持，我们在使用vm.arr取值触发arr的getter时可以对[1, 3, 4, {x: 1}, [44]]进行依赖收集，而内层数组当然是不能做数据劫持，因此需要在外层数组依赖收集之后做循环递归收集。


## 4.watch的原理

创建了一个新的watcher, 多了一个选项叫做user: true,表示他是一个用户在watch中自定义的watcher, 创建的时候先取watch属性的值作为老值保存起来，修改值之后触发watcher更新再取新值，比较二者，如果不相等的话就执行回调。

## 5.computed的原理

创建了一个新的watcher, 多了一个选项叫做lazy:true, 表示他是一个计算属性watcher。

vue也会使用Object.defineProperty方法把计算属性定义在了vm上, 这样就可以直接在模板中使用。

处理函数默认不执行，当取值的时候才会执行，而且会把这个值缓存起来，缓存主要是通过把dirty改为false来实现，当依赖的值变化会把dirty改为true, 这样就会重新取值。

刚开始取值的时候计算属性所依赖的属性会把该计算属性watcher和渲染watcher都收集起来，这样当依赖的属性变化之后就会重新计算计算属性的值，然后更新视图。

和watch相比：
   1. computed有缓存机制
   2. computed属性可以直接放在模板中使用, 因为他的处理函数返回的是一个值。watch只适合用来处理监控逻辑
 ## 6. 虚拟dom

```js
let app = document.getElementById('app');

for (let key in app) {
	console.log(key);
}

```
每一次渲染dom都会遍历这个dom的属性，dom属性很多，这样性能就不好。

虚拟dom，也叫虚拟节点，就是一个对象，这个对象描述了真实的dom。

#### key的作用
vue使用key来唯一标识虚拟节点，这样能够准确的找到其对应真实dom。当列表发生变化时之前的元素都无需更改：
1. 新增时，只需要在合适的位置插入新的元素，其他元素不用改变。如果没有key的话就需要修改之前所有元素，最后再添加一个新的元素。
2. 删除时，只需要删除其中的某个元素，其他元素不用改变
3. 顺序发生变化，移动之前的元素即可
这样的话就能提高渲染效率，提高页面性能。

还有就是循环的时候尽量不要用索引,因为索引不能唯一标识虚拟节点

如果用索引的话：

比如旧的节点列表是:a b c d 索引分别对应 0 1 2 3, 新的节点列表是: d c b a, 而索引依旧是0 1 2 3, 这样的话虽然新的节点列表中的每一个节点都可以在旧的节点列表中匹配到但是节点的内容发生了变化，因此就需要一一去修改真实dom的内容，需要修改4次，这些修改可能会包含大量的dom操作，比如**a有1个子节点，而d有100个子节点，这样就会新创建99个子节点，也就会有99次真实dom创建和渲染。**而如果使用唯一标识的话只需要移动三次元素的位置就可以了，显然性能会得到提高。
## 7. 怎么理解vue渐进式开发
渐进式开发那必然是有一个基本的东西，也是核心的东西，对于vue来说这个核心的东西就是双向绑定和组件开发，在此基础之上如果我们想开发单页面应用那我们就可以使用vue-router,当项目越来越大组件间的通信就是一个大问题，这个时候我们就可以用vuex来对数据进行集中管理，同时我们也可以使用vue-cli来更方便的构建，这一系列就把vue变成了一个渐进式框架。
## 8. 什么是库？什么是框架？
jquery就是一个典型的库，提供了很多方法，我们主动地调用这些方法来实现自己的功能。而对框架来说，我们需要把特定代码放在特定的位置上，框架会帮我们来调用这些方法实现自己的功能， 这是一个被动的过程。
## 9. mvc和mvvm的区别
传统的mvc是用在后端开发中的，m就是model，对应都是数据库中的数据，v就是view，对应的是前端的页面，c就是controller，对应的是后端的控制器，根据用户输入的url来获取数据返回给页面。

mvvm就是把view拆封成了 view 和 viewmodel, 去掉了控制器。

model指的是js中的数据，viewmodel是视图模型， view就是前端页面, 数据通过viewmodel自动渲染到页面上，页面发生变化也会通过viewmodel更新数据，这就是双向绑定。这种情况下我们就不用手动去操作dom，十分方便。

## 10. vue的模板为什么只能有一个根节点？
vue是根据虚拟dom树来渲染页面的，既然是树当然必须只有一个根节点。

vue初次渲染时是先把老的vnode拷贝了一份，然后根据这个新的vnode生成了一个新的dom ? 

## 11. v-if 和 v-for不能连用
不能连用这里是指不能用在同一个元素上，主要是因为优先级问题：v-for的优先级要大于v-if的优先级 

我们想要的效果是如果show为false的话就不显示dom, 对于下面这种写法，效果虽然能实现但是性能会很差，因为这段代码编译后类似这个样子
```
arr.map(fruit => {
	return show ? 渲染(fruit) : ''
})
```
数组有多少项就要循环多少次，每次都要根据show来判断是否渲染dom，解决办法是用template包一层
```html
<template v-if="show">
<div v-for="fruit in arr" :key="fruit">{{fruit}}</div>
</template>
```
如果show为false，下面的逻辑就不走了，没有一次循环。

## 12. vue是怎么选择模板的？
1. 写了render， 就是用render函数，template就不起作用了；
2. 不写render, 写template，就使用template作为模板；
3. render和template都不写就采用外部模板也就是#app内部的html。
## 13. v-model怎么自定义？
主要是用在父子组件通信上,具体实现就是定义组件的时候提供了一个model选项把默认的value属性改为checked,默认的input事件事件改为change。比如
```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```
现在在这个组件上使用 v-model
```js
<base-checkbox v-model="lovingVue"></base-checkbox>
```
v-model其实就是一个语法糖，他的原生写法是:
```js
<base-checkbox :value="lovingVue" @input="val=>lovingVue="val"></base-checkbox>
```

## 14. 组件化开发
为什么要有组件化？
1. 实现复用
2. 方便维护代码
3. 可以组件级别更新。按照传统更新方法如果我们修改了某一个数据那么就会把整个页面都全部再渲染一遍，而组件开发就把更新控制在了组件内，并且拆分的越细就越能减少页面更新。vue的更新策略是给每一个组件都添加一个渲染watcher。

## 15. 组件通信
### 父子组件通信方式
有三种方式：
#### 1. 直接将父组件的方法传递给子组件，子组件内调用
##### 1.常规传递 
parent.vue:
```
<Son :money="money" :change-money="changeMoney"></Son>
```
son.vue:
```js
// template
<button @click="changeMoney(50)">更改父亲的钱数</button>
// script
props: {
   money: {
   	type: Number
   },
   'changeMoney': {
	type: Function,
	default: () => {}
}
```
##### 2. $attrs和$listeners
	
$attrs能拿到父组件所有传递过来的属性，$listeners能拿到父组件传递过来的方法

parent.vue:
```js
<son v-bind="{a: 1, b:2, c:3}" @fn1="fn1" @fn2="fn2"></son>
```
son.vue:
```js
// template
接收的属性：{{$attrs}}
接收的方法: 
<button @click="$listeners.fn1">触发接收过来的函数fn1</button>
<button @click="$listeners.fn2">触发接收过来的函数fn2</button>
```

#### 2. 父组件给子组件绑定方法，然后由子组件触发
##### 1. 使用自定义事件
   
   parent.vue:
   ```js
   <Son :money="money" @change-money="changeMoney"></Son>
   ```
   son.vue:
   ```js
   // template
   <button @click="change">点击按钮</button>
	// script
   change() {
		this.$emit('change-money', 50);// 触发自己身上绑定的click事件
	}
   ```
##### 2. 使用语法糖v-model或者.sync

v-model(v-model也可以自定义,上面已经说过了)或者.sync, 这种方式更适合于父子组件做数据同步, 先回顾一下v-model的用法吧
   
parent.vue:
```js
<Son v-model="money"></Son1> 
```
v-model的原生写法
```js
<Son :value="money" @input="val => money=val"></Son>
```
son.vue:

先看不自定义v-model的情况
```js
<button @click="$emit('input', 500)">点击按钮</button>
```
看到了吧，触发的是input事件，再看看自定义v-model
```js
// template
<button @click="$emit('change', 500)">点击按钮</button>
// script
model: {
	prop: 'money',
	event: 'change'
},
```

再来看下.sync的用法

parent.vue:
```js
<Son :mny.sync="money"></Son>//mny就是要传递给子组件的数据
```
.sync的原生写法
```js
<Son :mny="money" @update:mny="val=>money=val"></Son>
```
son.vue:
```js
<button @click="$emit('update:mny', 500)">点击按钮</button>
```
##### 3. ref
这个属性一般是我们需要操作dom的时候用到, 使用
```
this.$refs.xxx
```
如果用在组件上就是获取组件的实例，这样就可以使用组件的属性或者方法了，当然这也不推荐，这里就要说到组件间的单向数据流的问题了，我们期望的是父组件的数据更新导致子组件更新，而不是父组件直接修改子组件，或者子组件修改父组件， 说白了就是一切要以**单向的数据**为基准，来进行各种交互。使用ref父组件直接修改了子组件，这样就越过了数据，破坏的单向数据流这一原则。

### 跨级组件通信
#### provide和inject
父组件中使用provide把父实例暴露出去，后代组件如果需要用到父组件的数据就使用inject把父实例注入进来。这种方式适用于后代组件只使用父组件数据而不修改，多用于我们自己写的库里。

parent.vue:
```js
provide() {// 提供者 上下文
	return {parent: this}// 将这个组件暴露出去
},
```
son.vue:
```js
// template
{{parent.money}}

// script
inject: ['parent'],
```
上述的方法就会造成单向数据流的混乱, 因为数据并不是一层一层往下传递，如果是中间隔了n代的两个组件，要去找数据的来源不得累死。而且后代组件是可以更改父组件的数据的，但是非常不建议，还是因为这也会破坏数据流的方向。

#### $parent和$children
这种只能用在父子关系非常明确的场景下，但是如果层级比较深，查找就变得冗长，不利于维护。如果当前组件是孙子组件想要触发爷爷组件上的方法，我们就会会写出这样的代码
```js
<button @click="$parent.$parent.$emit('eat', 'rice')"></button>
```
这当然是不可取的。

element-ui内部就针对这种情形做了处理，使用$dispatch来触发事件，不用再去纠结谁是谁的父亲的问题，本组件内只管触发，只要你辈分大而且绑定了事件那你就执行就好了, 查找操作封装在了它的内部。
#### $dispatch和$broadcast
我们也可以来写一个$dispatch方法
```js
Vue.prototype.$dispatch = function(eventName, value) {
	let parent = this.$parent;
	while(parent) {
		parent.$emit(eventName, value);// 没有绑定触发也不会有影响
		parent = parent.$parent;
	}
}
```
对应的绑定
```js
<Parent @eat="eat"></Parent>
```
然后这样使用就可以了
```js
<button @click="$dispatch('eat', 'rice')">触发eat</button>
```
这样的写法就会有一个问题，那就是dispatch之后所有的长辈级组件只要绑定了都会触发，不能有针对性的触发。

我们可以改动一下，使用组件名来限制触发
```js
Vue.prototype.$dispatch = function(eventName, componentName, value) {
	let parent = this.$parent;
	while(parent) {
		if (parent.$options.name === componentName) {
			parent.$emit(eventName, value);// 没有绑定触发也不会有影响
			break;
		}
		parent = parent.$parent;
	}
}
```
使用
```
<button @click="$dispatch('eat', 'parent', '米饭')">触发eat</button>
```
这样就只会触发爷爷上面绑定的eat方法了。

$dispatch是从下往上找父组件，与之相对的还有一个$broadcast从上往下称为广播，我们也来实现一下
```js
Vue.prototype.$broadcast = function (eventName, componentName, value) {
	let children = this.$children; // 数组
	// console.log(children);
	function broadcast(children) {
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			if (componentName === child.$options.name) {
				child.$emit(eventName, value);
				return;
			} else {
				if (child.$children) {
					broadcast(child.$children);
				}
			}
		}
	}
	broadcast(children);
}
```
因为一个父组件可能有多个子组件所以要稍微复杂一点需要用递归来寻找对应组件。当然我们上面实现的只是根据组件名称找到某一个组件触发其事件，如果想要实现多个，可以使用数组来存放目标组件，这里就不再展开了。

### 兄弟组件间通信
这里就用到了我们经常会用到的事件车：eventBus

我们可以给Vue提供一个方法:
```js
Vue.prototype.$bus = new Vue();
```
它的原理很简单，我们知道每个Vue实例上都会有$on, $emit, $off方法，使用$on和$emit再加上所有的组件都使用$bus这同一个实例，不就可以凑出来一个发布订阅模式了。

说起事件车我们来看一道面试题：子组件如何监听父组件的mounted事件？

首先我们要知道父子组件的渲染顺序：
1. 渲染父组件
2. 渲染子组件
3. 子组件mounted
4. 父组件mounted

就是先子后父的顺序,这样我们就有了思路：可以先在子组件的mounted中监听， 然后在父组件中触发
子组件:
```js
mounted() {
	this.$bus.$on('监听事件', function(params) {
		console.log(params);
	});
}
```
父组件:
```js
mounted() {
	this.$bus.$emit('监听事件', 'hello');
}
```
当然这种方式也是有缺陷的：
1. 一个事件触发，所有监听了该方法的地方都会进行响应，所谓一呼百应，这一点类似于$dispatch和$broadcast,只不过$dispatch和$broadcast有明显的上下级关系。这种情况下，如果组件非常多，尤其是在多人协作的情况下，当事件名重复将会带来巨大麻烦。所以eventBus只适合于小规模开发，大规模开发就需要使用vuex了。
2. 订阅和发布的顺序。如果发布在前订阅在后当然就不会有反应，这个其实还是挺常见的，这就需要严格要求两个组件间引入的顺序或者控制好发布的时机。

### 总结
父子组件通信
1. 我们一般常用的就是自定义事件
2. 一些特殊场合比如父子组件之间需要数据同步，有输入框这种,推荐使用v-model。

跨级组件通信，使用我们自定义的$dispatch和$broadcast，可以精确的触发某个组件上的事件，这样出了问题排查起来就会很省力。

兄弟组件通信，使用eventBus就好了，但是要注意发布和订阅的顺序问题。
## 16. 递归组件
给组件一个名字，你就可以递归使用他。

## 17. vue-lazyload的原理
1. 使用Vue.directive方法创建了一个v-lazy指令。
1. 给需要滚动的盒子监听了scroll事件，这里面用到了节流以优化性能。
2. 给每一个img标签都加上了一个指令v-lazy，在其内部是给每一个img标签都创建了一个对应的listener，这个listener用来判断当前的图片是否已经在可视区域，如果在可视区域就加载这个图片。  
3. 内部维护了一个listener的队列，每次滚动的时候就依次去判断是否要渲染对应的图片。