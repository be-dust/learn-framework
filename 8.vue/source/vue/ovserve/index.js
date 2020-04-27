/**
 * 初始化数据
 */
import Observer from './observer';
import Watcher from './watcher';
import Dep from './dep';

export function initState(vm) {
	// 做不同的初始化工作
	let opts = vm.$options;
	if(opts.data) {
		initData(vm);
	}
	if (opts.computed) {
		initComputed(vm, opts.computed);
	}
	if (opts.watch) {
		initWatch(vm);
	}
}

export function observe(data) {
	if (typeof data !== 'object' || data == null) {
		return;// 不是对象或者是null undefined就返回
	}

	if (data.__ob__) {// 已经被监控过了
		return data.__ob__;
	}

	return new Observer(data);
}

function proxy(vm, source, key) {
	// vm.msg = 'hello' => vm._data.msg = 'hello'
	Object.defineProperty(vm, key, {
		get() {
			// console.log('get走到代理vm._data');
			return vm[source][key]
		},
		set(newValue) {
			// console.log('set走到代理vm._data');
			vm[source][key] = newValue;
		}
	})
}

function initData(vm) {// 将用户传入的数据通过Object.defineProperty重新定义
	let data = vm.$options.data;// 用户传入的data
	// 用户传入的data可能是函数，也可能是对象, 也可能没传, 我们需要做一个判断, 而我们不希望改掉用户传入的data，所以重新定义一个新的_data属性
	data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}; // data和vm._data是一样的， 并不是拷贝， 也就是说如果vm.$options.data是一个对象那么修改了vm._data或者vm.$options.data二者都会同时改变，但一般情况下我们传入的data是一个函数，所以就没有这个问题.

	for (let key in data) {
		proxy(vm, '_data', key);// 会将对vm上的取值和赋值操作代理给vm._data属性
	}

	observe(vm._data);// 观察数据
}

function createComputedGetter(vm, key) {
	let watcher = vm._watchersComputed[key];// 这个watcher就是计算属性watcher
	return function() {// 用户取值时会执行这个方法
		if (watcher) {
			// 如果dirty为false那就不需要重新执行计算属性中的方法，直接返回上一次的值
			if (watcher.dirty) {// 如果页面上取key的值了，并且dirty为true，就会调用watcher的get方法
				watcher.evaluate();
			}

			// 2. 初始化时全局的watcher是渲染watcher，dep文件中的stack是[渲染watcher], 当执行fullName的watcher的evaluate方法然后执行get方法后这个stack就变成了[渲染watcher, fullName的watcher]， 全局的watcher就是fullName的watcher, get方法执行完毕stack又变成了[渲染watcher], 全局的watcher就是渲染watcher,
			// 走到这时get方法已经执行完毕，全局watcher已经变成了渲染watcher,这一步主要是为了firstName和lastName对渲染watcher进行收集
			if (Dep.target) {// Dep.target就是渲染watcher
				watcher.depend();// 这个watcher是计算属性watcher
			}
			return watcher.value;
		}
	}
}

function initComputed(vm, computed) {
	// 将计算属性的配置放到vm实例上 watchers存放了所有的计算属性的watcher
	let watchers = vm._watchersComputed = Object.create(null);// 创建一个存储计算属性的watcher的对象

	for(let key in computed) { // fullName() {}

		let userDef = computed[key];

		// new的时候只是配置了lazy dirty
		watchers[key] = new Watcher(vm, userDef, () => {}, {lazy: true});// lazy:true表示是一个计算属性，表示希望初始化时这个方法不会执行

		// 当取计算属性的值的时候才去执行用户传入的方法
		// 将这个属性定义到vm上
		Object.defineProperty(vm, key, {
			get: createComputedGetter(vm, key)
		});

	}
}


function createWatcher(vm, key, handler, opts) {
	// 内部最终也会使用vm.$watch方法
	return vm.$watch(key, handler, opts);
}
function initWatch(vm) {
	let watch = vm.$options.watch;// 获取用户传入的watch属性
	
	for (let key in watch) {
		// let handler = watch[key];
		
		let userDef = watch[key];// 用户传入的可能不是函数,而是个对象
		let handler = userDef;

		if (userDef.handler) {
			handler = userDef.handler;
		}
		createWatcher(vm, key, handler, {immediate: userDef.immediate});
	}
}