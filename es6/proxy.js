// 代理 + reflect 反射 es6

/* let obj = {
	a: 1,
	b: 2,
	c: {
		c: 3
	}
};

// 不需要掌握更新值的api
// obj.a = 100;

// let proxy  = new Proxy(obj, {
// 	get(target, key) {
// 		return target[key];
// 	},
// 	set() {
// 		console.log('set');
// 	}
// });
// // proxy.c = 100;// 可以取到原对象不存在的属性
// console.log(proxy.a);

const update = () => {
	console.log('更新');
}
let handler = {
	get(target, key) {// Reflect能反射13种
		if (typeof target[key] === 'object') {
			// 
			return new Proxy(target[key], handler);
		}
		return Reflect.get(target, key);
	},
	set(target, key, value) {
		// target[key] = value;
		// return true 等
		// 上面两行同于 return Reflect.set(target, key, value);

		// let b =  Reflect.set(target, key, value);
		// console.log(b);// true

		let oldValue = target[key];
		if (oldValue !== value) {
			update();
			return Reflect.set(target, key, value);
		}
	}
}
let proxy  = new Proxy(obj, handler);
// console.log(proxy.a = 2);
proxy.c.c = 10;// proxy不会一开始就给每个属性加上setter, getter,而是访问到某个属性是对象了才会去new一个proxy，这样的话性能会更好
 */




/* // 以后所有对象Object的新方法都会放到Reflect上，原有的方法也会迁移到Reflect上
// 使用Object.defineProperty(obj)如果obj被freeze那么就会报错, 通过Reflect就能解决
let obj = Object.freeze({a: 1});
let flag = Reflect.defineProperty(obj, 'c', {

});
console.log(flag);// false */




// 数组的代理
let arr  = [1, 3, 3];
const update = () => {
	console.log('更新');
}
let handler = {
	get(target, key) {// Reflect能反射13种
		if (typeof target[key] === 'object') {
			// 
			return new Proxy(target[key], handler);
		}
		return Reflect.get(target, key);
	},
	set(target, key, value) {
		console.log(key);// 修改了索引为3的哪一项和length
		let oldValue = target[key];
		if (oldValue !== value) {
			update();
			return Reflect.set(target, key, value);
		}
		return true;// 修改length时没有返回，所以这里要加一个返回
	}
}
let proxy  = new Proxy(arr, handler);
proxy.push('aaaa');
console.log(arr);

arr[2] = 100;
console.log(arr);

arr.length = 6;
console.log(arr);

arr.d = 'ddd';
console.log(arr);