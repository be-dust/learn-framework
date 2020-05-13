// Object.create(null); 创建一个纯净的对象

let ns = Object.create(null);
console.log(Object.getPrototypeOf(ns));// null, 这样的话创建出来的对象的__proto__就是null，是一个纯粹的空对象

// let obj = {};// {} 就是通过new Object()生成，所以obj.__proto__ = Object.prototype, 这样的话obj上就有很多不属于自己的方法
// console.log(Object.getPrototypeOf(obj));// {}, 

// 自己实现一个Object.create
function create(parentPrototype) {
	function Fn() {}
	Fn.prototype = parentPrototype;
	return new Fn();
}


