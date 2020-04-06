import {pushTarget, popTarget} from './dep';
import { util } from '../util';
import { nextTick } from './nextTick';

let id = 0;// 每次产生一个watcher都要有一个唯一的标识
class Watcher {
	/**
	 * 
	 * @param {*} vm 当前组件的实例 new Vue
	 * @param {*} exprOrFn  用户传入的是一个表达式或者是一个函数
	 * @param {*} cb 用户传入的回调函数 vm.$watch('msg', cb)
	 * @param {*} opts 一些其他参数
	 */
	// watch参数列表：  vm, msg, (newValue, oldValue) => {}, {user: true}
	// computed参数列表： vm, () => this.firstName + this.lastName, () => {}, lazy:true
	constructor(vm, exprOrFn, cb = ()=>{}, opts = {}) {
		this.vm = vm;
		this.exprOrFn = exprOrFn;
		if (typeof exprOrFn === 'function') {
			this.getter = exprOrFn;// 这里的exprOrFn就是更新函数
		} else {// 用户自己写的watch方法，传入的exprOrFn不是一个函数，而是一个key
			this.getter = function() {
				return util.getValue(vm, exprOrFn);// 取出vm[exprOrFn], 这样就触发了getter, 在getter中exprOrFn的dep就把用户自定义的watcher添加进去了
			}
		}

		if (opts.user) {
			this.user = true;
		}

		this.cb = cb;
		this.deps = [];
		this.depsId = new Set();
		this.opts = opts;
		this.id = id++;

		this.lazy = opts.lazy;// 计算属性computed使用
		this.dirty = this.lazy;// computed比watch多了一个缓存, 默认为true

		this.immediate = opts.immediate;// watch使用
		
		// this.get();// 创建一个watcher 会调用自身的get方法

		// this.value = this.get();// 创建watcher的时候先把表达式的值取出来， 这个就是最原始的数据

		this.value = this.lazy ? undefined : this.get();// 如果是计算属性的话，刚开始不会执行get方法

		if (this.immediate) {
			this.cb(this.value);
		}
	}
	get() {
		pushTarget(this);// 如果某一个属性有多个watcher，当修改这个属性值的时候会触发他的setter,从而触发了他所有的依赖更新，比如对某一个watcher来说, 执行 watcher.update()，然后执行他的get(), get()内部会把Dep.target指向他本身，这样的话每次依赖更新的时候全局的watcher都是当前的那个watcher
		
		// this.getter();// 执行更新函数，这个函数会取数据进行渲染，取数据就会走到这个数据的getter

		
		// let value = this.getter();

		let value = this.getter.call(this.vm); // 1. 对计算属性来说：this.getter就是() => this.firstName + this.lastName, 初始化页面时执行计算属性的get方法(这个get方法是在createComputedGetter定义的)就会取到fullName, 取firstName和lastName的过程中也会各自收集依赖, 但是注意了，这个时候全局的watcher是fullName的watcher, 因此他们收集到的watcher是fullName的watcher而不是渲染watcher, 因为这个时候还没有执行popTarget(), 因此当他们的值发生变化时页面不会更新, firstName和lastName还需要对渲染watcher进行收集，主要逻辑就放在了createComputedGetter这个函数内部的watcher.depend方法中。
		popTarget();
		return value;
	}
	// 计算属性使用
	evaluate() {
		this.value = this.get();// this就是计算属性的watcher
		this.dirty = false;// 值已经求过了，下次渲染的时候就不需要再取了
	}
	addDep(dep) {// 同一个watcher 
		let id = dep.id;
		if (!this.depsId.has(id)) {
			this.depsId.add(id);
			this.deps.push(dep);
			dep.addSub(this);//让dep记住这个watcher
		}
	} 
	depend() {
		// 3. fullName计算属性的watcher的deps，上面说了firstName和lastName收集了fullName的watcher,因此这个watcher的deps现在就是[firstName的dep, lastName的dep],this就是fullName的watcher
		let i = this.deps.length;
		while(i--) {
			this.deps[i].depend();// 4. 此时全局的watcher是渲染watcher,这样firstName和lastName的deps就变成了[fullName的watcher, 渲染watcher]，当二者任意一个发生变化时就会先通知fullName的watcher，从而取到最新的fullName，然后再通知渲染watcher，更新页面
		}
	}
	update() {// 如果立即调用get就会导致页面刷新，异步来更新
		// console.log(this.id);
		
		// this.get();

		if (this.lazy) {// 如果是计算属性依赖的值变化了稍后取值时就重新取值
			this.dirty = true;
		} else {
			// 我们先把这个渲染watcher放在队列里
			queueWatcher(this);
		}
	}
	// watcher更新时先走的是update方法，run方法只是为了异步更新
	run() {
		// this.get();
		
		let value = this.get(); // 新值
		if (this.value !== value) {
			this.cb(value, this.value);
		}
	}
}
// 异步更新
let has = {};
let queue = [];
function flushQueue() {
	queue.forEach(watcher => watcher.run());
	has = {};
	queue = [];
}
function queueWatcher(watcher) {
	let id = watcher.id;
	if (has[id] == null) {// 判断watcher存在否
		has[id] = true;
		queue.push(watcher);// 相同的watcher只会存一个

		// 延迟清空队列
		// setTimeout(flushQueue, 0);// 异步方法会等待所有同步方法执行完毕后才调用此方法
		nextTick(flushQueue);
	}
}

// 渲染使用 计算属性用， vm.$watch也用
export default Watcher;