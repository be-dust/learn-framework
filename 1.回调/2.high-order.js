高阶函数-面向切片编程

听上去很高大上，其实就是对某些函数进行扩展，从模式上将对应于装饰模式。

假设现在有这么一个方法
```
function say(who) {
	console.log('say', who);
}
```
我们要对它进行一些改造，在说话之前做一些事比如先刷牙，但是原有的say方法不能更改。

先说下思路，我们需要对say方法进行扩展然后返回一个新的函数，最好的办法就是修改原型
```
Function.prototype.before = function (callback) {
	return function(...args) { 
		callback();
		this(...args);
	}
}
```
这么写的话当在最外层调用时， 如果在浏览器中this就是window必定会报错的, 所以要使用箭头函数来代替,利用箭头函数没有this的特点来找到原函数say
```
Function.prototype.before = function (callback) {
	return (...args) => { 
		callback('你要');
		this(...args);
	}
}
```
测试
```
let newSay = say.before(function(params) {
	console.log(params, '先刷牙');
});

newSay('我');
```
function say(who) {
	console.log('say', who);
}
Function.prototype.before = function (callback) {
	return (...args) => { 
		callback('你要');
		this(...args);
	}
}
let newSay = say.before(function(params) {
	console.log(params, '先刷牙');
});

newSay('我');