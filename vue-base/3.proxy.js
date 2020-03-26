// 如何使用proxy实现响应式原理

let obj = {
	name: {
		name: 1
	},
	arr: [1, 2, 3]
}
// 兼容性差
// 可以代理13种方法， 主要考虑set、get方法
// defineProperty只能针对特定的属性进行拦截
let handler = {
	// target就是原来的对象, key就是当前要取的那个值
	get(target, key) { 
		// 这里就可以收集依赖
		console.log('收集依赖')

		if (typeof target[key] === 'object' && target[key] !== null) {
			return new Proxy(target[key], handler);// 递归代理，这里就和Object.defineProperty有所区别，只有在使用到了才会收集依赖
		}
		
		// Reflect 反射，这个方法包含了很多的api
		// return target[key];
		return Reflect.get(target, key);
	},
	set(target, key, value) {
		// 判断一下是新增操作还是修改操作
		let oldValue = target[key];
		console.log(oldValue, value);
		if (!oldValue) {
			console.log('新增属性')// 数组新增之后长度立马就变了, 下一次oldValue就是新的长度
		} else if (oldValue !== value) {
			console.log('修改属性');
		}
		// console.log('触发更新', key);
		// target[key] = value;// 设置时如果设置不成功也不会报错,比如说原对象不可配置, 最好是有一个返回值
		return Reflect.set(target, key, value);
	}
}
// 懒代理， 也就是说只对obj这一层做了代理
let proxy = new Proxy(obj, handler);

// proxy.name;// 只走了obj的get方法
// proxy.name.name;// 先走obj的get方法，取到obj.name， 发现是一个对象就会把obj.name这一层做一个代理，然后当取obj.name.name是就会走obj.name的get方法
// proxy.name.name = 123;// 先走obj的get方法，取到obj.name， 发现是一个对象就会把obj.name这一层做一个代理，然后当设置obj.name.name是就会走obj.name的set方法
// console.log(obj.name.name)

/* 
proxy.arr.push(123); 
因为有3项所以有3次收集依赖，重点是2次触发更新
第一次：数组新增了一项，索引发生变化那么对应的key就是3
第二次：数组的长度发生变化,对应的key就是length
```
收集依赖
收集依赖
收集依赖
触发更新
触发更新
``` */
// proxy.arr[0] = 4;

// proxy.xxx = 100;