从这里我们开始学习js中的异步编程，从回调地狱到经典promise到如今最常用的async await，我们一个一个的从原理着手彻底搞懂他们。

## 异步
什么叫异步？简单说就是执行后的返回结果不能立马获取。

## 回调与异步
最早的异步解决方案是回调函数

node中大量用到了回调，回调函数的第一个参数永远是error，比如读取文件后的回调。

我们做一个思考：如果现在要读取两份文件，读取文件当然是异步的，那么基于回调函数怎么在两份文件都读取完成之后打印结果呢？

这里又用到了高阶函数,看看代码吧
```
let fs = require('fs');

function after(times, callback) {
	let renderObj = {};
	return function(key, value) {
		renderObj[key] = value;
		if (--times == 0) {
			callback(renderObj);
		} 
	}
}

// 使用after中间函数产生一个新函数
let out = after(2, function(renderObj) {
	console.log(renderObj);
});
fs.readFile('./age.txt', 'utf8', function(error, data) {	
	out('age', data);
});
fs.readFile('./name.txt', 'utf8', function(error, data) {	
	out('name', data);
});
```
核心就是使用闭包，一个计数器：控制输出结果的时机，一个中间变量：保存结果。

这种方式使用了一个中间函数不够直接，而且如果我们不想用out函数了呢？下面我们介绍一种经典的发布订阅者模式来试一试。

很多时候一提到发布订阅者模式我们就会想到观察者模式，这两个东西其实不是一个东西，观察者模式是发布订阅的一种应用，发布订阅者模式中，发布和订阅是没有任何关系的，而在观察者模式中必须是先有被观察者才会有观察者。

我们熟悉的promise内部就用了发布订阅，我们将会在接下来的学习中看到。

关于发布订阅我们只要记住

订阅： on， 就是将函数放到数组中

发布：emit，就是让订阅的数组中的方法依次执行
```
let fs = require('fs');

let e = {
	_obj: {},
	_callback: [],
	on(callback) {
		this._callback.push(callback);
	},
	emit(key, value) {
		this._obj[key] = value;
		this._callback.forEach(method => {
			method(this._obj);
		});
	}
}

e.on(function(obj) { // 每次发布都要触发此函数
	console.log(obj);
});

fs.readFile('./age.txt', 'utf8', function(error, data) {	
	e.emit('age', data);
});
fs.readFile('./name.txt', 'utf8', function(error, data) {	
	e.emit('name', data);
});
```

读取文件之后就向外emit抛出一个事件，不用关心是否有没有订阅者，从而就做到了解耦合，书写代码就更加灵活。