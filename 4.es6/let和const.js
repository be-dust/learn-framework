// es6规范 尽量不要使用var

// var导致的问题 
// 1. 重复声明不会报错 
// 2. 变量提升 
	// 变量提升的几种方式？ var function import(和function效果一样) 
// 3.var默认会把变量声明到全局上 

// 4. 没有作用域概念  
	// let不会被声明到window上， 可以和{}配合使用组成一个作用域

let a = 100;
{
	console.log(a);// 会现在当前作用域查找a，当前作用域存在a，但是a还未定义，这就是暂存死区
	let a = 1;
}
console.log(a);
// 编译成es5
// "use strict";

// var a = 100;
// {
//   console.log(_a);// 两个不同的a
//   var _a = 1;
// }
// console.log(a);


// 5.我们声明的变量有些不需要更改的但是可以随意更改
	const 只要不是深度改变就可以，如果是引用空间，可以修改引用空间内的内容
