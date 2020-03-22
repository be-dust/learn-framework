## call

call的作用有两个:  
1. 改变this指向
2. 可以让函数执行

下面我们就通过自己实现一个call来看看它的原理
```
function fn() {
	console.log(this);
}
Function.prototype.call = function(thisValue, ...args) {
	if (thisValue == null) {// 包含了undefined和null两种情况
		return fn(...args);
	}
	if (typeof thisValue !== 'object') {
		thisValue = new Object(thisValue);
	}
	let context = this;// context就是fn，原函数
	thisValue.f = context;// 这样f作用域中的this就是thisValue,也就是我们传进去的那个新的上下文
	thisValue.f(...args);
	delete thisValue.f;
}

fn.call(null);
fn.call(1,3,4,5);
```
我们简单总结下其中的过程：
1. 当然是类型判断
2. 保存原函数
3. 绑定新的上下文
4. 执行原函数

就是这么so easy。

简单？那我们做一个面试题试试看,下面代码的结果是什么？
```
function fn() {
	console.log(this);
}
function fn2() {
	console.log('fn2');
}
fn.call.call.call(fn2);
```
是不是突然就蒙了?最后结果是fn2

一步步分析:

首先fn.call，很明显fn上面没有call方法那么就去fn的__proto__上找，找到了Function.prototype.call，这个call方法就是所有函数都有的call方法

继续，fn.call.call也就是要找到Function.prototype.call上的call方法，别忘了call本身也是一个函数，他自然有call方法，所以到了这一步其实就是拿到了原型上的call方法

最终的结果就是call方法.call(this), 而this就是fn2。


## apply
apply基本上和call一样，区别主要是在参数上，apply的第二个参数是数组
实现：
```
Function.prototype.apply = function(thisValue, args) {
	if (thisValue == null) {
		return fn(args);
	}
	if (typeof thisValue !== 'object') {
		thisValue = new Object(thisValue);
	}
	let context = this;
	thisValue.f = context;
	thisValue.f(args);
	delete thisValue.f;
}
```

这里我们想一下，如果一个函数有自己的apply方法，那么如果想使用原型上的apply方法怎么实现呢？
```
function fn() {
	console.log(this, arguments);
}
fn.apply = function() {
	console.log('inner apply');
}
```
很明确
```
fn.apply();
```
只会调用自己的apply方法,  那么下面的写法呢?
```
Function.prototype.apply(fn, [2, 3, 4]);
```
乍一看是那么回事，其实是错误的，我们结合上面apply实现的原理，此时apply内部的this是Function.prototype这明显不对了。正确的写法是
```
Function.prototype.apply.call(fn, 1, [2,3,4]);
```
这种写法其实就等效于
```
let f = Function.prototype.apply;
f.call(fn, 1, [2, 3, 4]);
```
call的内部会执行
```
fn.f(1, [2,3,4]);
```

这样call方法把Function.prototype.apply方法的this变为了fn, 后面的 1, [2,3,4]作为Function.prototype.apply的参数传入，那么1就相当于Function.prototype.apply方法thisValue, [2, 3, 4]就是参数。如果用Reflect的话就会更简单，这种写法以后再细说。
```
Reflect.apply(fn, 1, [2, 3, 4]);
```

## bind
bind的作用：返回一个新的函数，并且可以改变this指向,注意它的返回值是一个函数。

实现也很简单：
```
Function.prototype.bind = function(thisValue, ...args) {
	if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
	if (typeof thisValue !== 'object') {
		thisValue = new Object(thisValue);
	}
	let context = this;
	thisValue.f = context; // 这个f可以通过Object.defineProperty变为不可枚举
	console.log(thisValue);
	return function(...values) {
		thisValue.f(...args, ...values);
	}
}
function fn(...args) {
	console.log(this, args);
}
let bindFunc = fn.bind(1, 2); 
bindFunc = bindFunc.bind(5, 5);
bindFunc = bindFunc.bind(100, 100);
bindFunc(3);
```
结果
```
[Number: 1] { f: [Function: fn] } [ 2, 5, 100, 3 ]
```
我们测试了比较复杂的场景，但是多次绑定之后的结果依然是1。

因为第一次bind之后返回了一个函数f，之后的bind都是把这个函数f挂载到了一个新的对象上，比如f挂载到5返回f1, 然后f1挂载到100返回f2, 最终的执行顺序就是
```
function f2 () {// 先执行f2
	console.log(this);// this就是100 然后执行100.f1
	function f1 () {
		console.log(this);// this就是5 然后执行5.f
		function f () {
			console.log(this) // this是1 
			fn(); // 最终执行的就是1.fn(), 所以结果是1
		}	
	}
}
```
所以说多次绑定无意义，但是传参是有意义的。
