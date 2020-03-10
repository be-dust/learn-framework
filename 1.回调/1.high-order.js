// 什么叫高阶函数： 
// 1. 如果一个函数的参数是一个函数（回调函数也是一个高阶函数）
// 2. 如果一个函数返回一个函数 这个函数就叫高阶函数
// 闭包

// 1) 判断类型 
// typeof 无法辨别对象类型
// constructor 谁构造出来的
// instanceof 判断谁是谁的实例 简单类型无法判断
// Object.prototype.toString.call

function isType(type) {
	return function(content) {
		return Object.prototype.toString.call(content) === `[object ${type}]`
	}
}
// 高阶函数实现了第一个功能， 保存变量 (闭包)
let isString = isType('String');
// 什么叫闭包？在定义的时候 函数就决定了 一个函数不在自己的所在作用域下执行
isString('hello');

let isNumber = isType('Number');
isNumber(123);
// isType('hello', 'String');
// isType(123, 'Number');



// 面试题， 函数的柯里化和反柯里化

// 柯里化: 把一个函数具体化，细化。把一个有n个参数的函数通过一个中间函数最终生成一个只需要一个参数的函数
function isType(type, content) {

}
let isString = currying(isType, 'String');

// 反柯里化： 把一个函数扩大化 Object.prototype.toString => toString()

