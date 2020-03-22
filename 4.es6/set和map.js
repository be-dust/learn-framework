// 数据结构： 链表 队列 栈 集合 hash表 图 数
// set集合 map映射表

// let set = new Set();// 不能放重复的项

// 数组求 并 交 差 
// let arr1 = [1, 1, 1, 2, 6];
// let arr2 = [1, 2, 3, 4];

// 求并集合
// 把两个数组变成一个数组： concat, 展开运算符...
// let union = new Set([...arr1, ...arr2]);
// console.log(union)

// 求交集
// function intersection(arr1, arr2) {
// 	let s1 = new Set(arr1);// 先去重
// 	let s2 = new Set(arr2); // set 可以判断是否存在 
// 	// 集合有迭代器所以可以用...展开
// 	// console.log(Array.from(s1), [...s1]);
// 	return [...s1].filter(item => {
// 		return s2.has(item);
// 	});
// }
// console.log(intersection(arr1, arr2));

// 求差
// function intersection(arr1, arr2) {
// 	let s1 = new Set(arr1);// 先去重
// 	let s2 = new Set(arr2); // set 可以判断是否存在 
// 	// 集合有迭代器所以可以用...展开
// 	// console.log(Array.from(s1), [...s1]);
// 	return [...s1].filter(item => {
// 		return !s2.has(item);
// 	});
// }
// console.log(intersection(arr1, arr2));


// Array.from 和 ...的区别？他们两个的功能都是把类数组变成数组
// 类数组: 有索引 有长度 是个对象 能被迭代

// Array.from 不借助自身的迭代器， ... 能展开的内容必须要有迭代器

/* Array.from([...{
  a: 1,
  b: 2,
  length: 2
}])

// 编译后为
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

Array.from(_toConsumableArray({
  a: 1,
  b: 2,
  length: 2
})); */

// console.log([...{
// 	0: 1,
// 	1: 2,
// 	length: 2
// }]); // console.log is not iterable (cannot read property Symbol(Symbol.iterator))

// 正确写法：
// console.log([...{
// 	0: 1,
// 	1: 2,
// 	length: 2,
// 	[Symbol.iterator]: function * () {// 生成器可以产生迭代器
// 		let idx = 0;
// 		while( idx !== this.length) {
// 			yield this[idx++];
// 		}
// 	}
// }]);



// -------------------

// 不能对象套对象
// {
// 	{}: {}
// }

// map的key可以是任何值， 不能放重复值
// let map = new Map([['a', 1], ['b', 1], [{'c':1},{'d': 1}]]);// 参数是二维数组
// console.log(map);

// forEach ... set get

// let a = {b:1};
// let m = new Map();
// m.set(a, 100);
// a = null;
// console.log(m);//Map { { b: 1 } => 100 }  m中依然存在着对a的引用

// WeakMap不会导致内存泄露问题
// let a = {b:1};
// let m = new WeakMap();// WeakMap WeakSet 表示都是弱引用 key只能是对象，因为普通值不存在引用关系
// m.set(a, 100);
// a = null;
// console.log(m);// WeakMap { <items unknown> }


