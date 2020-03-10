// 展开运算符 ...

// let obj = {name: 'zx', age: '10'};
// // 拷贝一份obj
// let newObj = {...obj};

// 拷贝前的和拷贝后的没关系 就是深拷贝

// 拷贝后的结果还有引用以前的引用空间 就是 浅拷贝

// 实现深拷贝
// 考点1： 当前数据类型校验
// 考点2： 循环引用问题

// typeof Object.prototype.toString.call instanceof constructor 

function deepClone(value, hash = new WeakMap) {
	// 排除null undefined
	if (value == undefined) return;// 使用 === 代替 ==
	// 排除 string number boolean function
	if (typeof value !== 'object') return value;

	if (value instanceof RegExp) return new RegExp(value);
	if (value instanceof Date) return new Date(value);

	if (hash.get(value)) {
		return hash.get(value);
	}

	// 只剩下对象和数组
	// console.log(Object.prototype.toString.call(value));

	// 使用constructor来生成, 不再判断类型
	// new({}).constructor;// {}
	// new([]).constructor;// []

	// 先把instance存起来， 下次如果再拷贝他直接返回就好了
	let instance = new value.constructor;
	hash.set(value, instance);
	console.log(hash);
	for (let key in value) {
		if (value.hasOwnProperty(key)) {// 不拷贝原型链上的属性
			instance[key] = deepClone(value[key], hash);
		}
	}
	return instance;
} 
// deepClone();// string number 基础类型 函数 对象(正则 日期)或者数组 undefined null 

// let obj = {name: 'zx', age: 25, a: {b: 1}};
// let newObj = deepClone(obj);
// newObj.a.b = 2;
// console.log(obj, newObj);

// 循环引用 如果当前对象已经被拷贝了那么就不再拷贝了
const a = {val:2};
a.target = a;

console.log('结果', deepClone(a));