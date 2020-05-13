import { initState } from './ovserve/index';
import Watcher from './ovserve/watcher';
import { compiler, query } from './util';
import { h, render, patch} from './vdom';

function Vue(options) {// 用户传入的原始数据
	this._init(options);// 初始化vue，且将用户选项传入
}

Vue.prototype._init = function(options) {
	// vue初始化 this.$options 表示的是vue中的参数
	let vm = this;
	vm.$options = options;

	// MVVM原理，核心就是需要将数据重新初始化 
	initState(vm); // 数据部分包括data、computed、 watch

	// 初始化工作 vue1.0 => 
	if (vm.$options.el) {
		vm.$mount();
	}
}


Vue.prototype._update = function(vnode) {
	console.log('视图渲染');
	let vm = this;
	// 用用户传入的数据去更新视图
	let el = vm.$el;

	let preVnode = vm.preVnode;// 第一次肯定没有
	if (!preVnode) {// 初次渲染
		vm.preVnode = vnode;// 保存上一次的节点为了下次更新时做比对
		render(vnode, el);
	} else {
		vm.$el = patch(preVnode, vnode);
	}

	// // 循环这个元素将里面的内容换成我们的数据
	// let node = document.createDocumentFragment();
	// let firstChild;
	// while(firstChild = el.firstChild) {
	// 	node.appendChild(firstChild);// appendChild有移动的功能，会把当前元素移动到文档碎片中，这样el中就没有内容了
	// }
	// // 将文本进行替换
	// compiler(node, vm);
	// el.appendChild(node);

	
}

Vue.prototype._render = function() {
	let vm = this;
	let render = vm.$options.render;// 获取用户编写的render方法， 如果用户传入的是template，那就根据template生成一个render函数放在vm.$options上，这个时候还没有把真正的数据放进去

	let vnode = render.call(vm, h);// 这个函数返回的是一个vnode， 第一个参数是当前vm实例用来获取数据， h就是用来创建虚拟节点, 执行render之后生成的虚拟节点就包含真正的数据。
	return vnode;
}

// 渲染页面
Vue.prototype.$mount = function() {
	let vm = this;
	let el = vm.$options.el;
	el = vm.$el = query(el);// 获取当前挂载的节点 

	// 渲染是通过watcher来渲染的
	// 渲染watcher 就是用于渲染的watcher
	// vue2.0 组件级更新 

	let updateComponent = () => {// 渲染、更新组件
		// console.log('执行了');
		// vm._update();// 定义一个_update函数首次渲染和更新组件时调用
		vm._update(vm._render());
	}
	new Watcher(vm, updateComponent);// 渲染watcher, new的时候就会默认调用updateComponent

	// 需要让每个数据更改之后就重新渲染页面
}

Vue.prototype.$watch = function(expr, handler, opts) {
	let vm = this;
	// 原理也是创建一个watcher
	new Watcher(vm, expr, handler, {user: true, ...opts});// user: true表示用户自定义的watch
}

export default Vue;