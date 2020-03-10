// defineProperty 修改原对象， proxy代理 数据劫持
// let el = {
// 	_content: '',
// 	get html() {
// 		return this._content;
// 	},
// 	set html(value) {
// 		this._content = value;
// 	}
// }

// el.html = '123';

// let obj = {};
// let newA = 12;
// Object.defineProperty(obj, 'a', {
// 	enumerable: false,// 如果用es5来模拟es6的类，需要使用此方法, es6中写的方法是不能被枚举的
// 	configurable: false,// 能不能被配置, 来判断是否能被重新定义
// 	// writable: true,
// 	get() {
// 		return newA;
// 	},
// 	set(value) {
// 		newA = value;
// 	}
// });

// obj.a  = 34;
// console.log(obj.a);

// Object.freeze 性能优化 , 被冻结后的对象不能再被改写
// let obj1 = Object.freeze({a: 1});
// Object.defineProperty(obj1, 'qqq', {
// 	get() {
		
// 	},
// 	set(value) {
		
// 	}
// });


// 数据劫持 vue 要监控数据的变化，数据变化后要更新视图
// let data = {
// 	a: 1,
// 	b: 2
// };

let data = Object.freeze({
	a: 1,
	b: 2
});

const update = () => {
	console.log('视图更新');
}
// 这里还没有支持数组
function defineReactive(target, key, value) {
	observe(value);// 如果是深层次 需要递归处理
	// vue内部源码会判断 如果不能修改则不会重新定义属性
	if (!Object.getOwnPropertyDescriptor(target, key).configurable) return;
	Object.defineProperty(target, key, {
		get() {
			return value;
		},
		set(newValue) {
			if (value !== newValue) {
				value = newValue;
				update();
			}
		}
	})
}

function observe(target) {
	if (target == null || typeof target !== 'object') return target;

	for (let key in data) {
		defineReactive(target, key, data[key]);// 写成一个方法好处是可以使用闭包
	} 
}

observe(data);
data.a = 100;

// 上面的缺陷就是不支持数组，深层次还要递归性能不好, 如果key不存在就不能响应式处理