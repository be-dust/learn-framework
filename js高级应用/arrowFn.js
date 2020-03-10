箭头函数特点：没有this、没有arguments、没有prototype, 整个就是三无产品。

ok，我们先看看没有this的情况，先从有this的情况说起，好做个对比，看下面代码分析运行结果
```
let obj = {
	a: 1,
	say() {
		console.log(this.a);
	}
}
obj.say();
```
很明显，结果是1,那再看下面代码
```
let a = 100;
let obj = {
	a: 1,
	say() {
		setTimeout(function() {
			console.log(this.a);
		}, 1000);
	}
}
obj.say();
```
结果是undefined，为什么呢？

当定时器内的函数执行时，作用域是全局window,那么内部的this指向的就是window,this.a就是window.a，但是我们注意了 let a = 100, 使用let不会污染全局变量也就是a没有放在window上，所以取不到a， 所以结果是undefined.

那怎么能取到1呢?答案就是使用箭头函数
```
let a = 100;
let obj = {
	a: 1,
	say() {
		setTimeout(() => {
			console.log(this.a);
		}, 1000);
	}
}
obj.say();
```
虽然定时器内的函数时window调用的，但是箭头函数内没有this，也就是说window不会作为this给到函数，只会向上查找父级作用域，这样就能取到1了。

好了，我们再改一改代码:
```
let a = 100;
let obj = {
	a: 1,
	say: () =>  {
		setTimeout(() => {
			console.log(this.a);
		}, 1000);
	}
}
obj.say();
```
结果又是什么呢？

undefined

这里我们首先要明确一件事，箭头函数向上查找的是作用域，而对象不是作用域。

定时器内的函数依旧是window调用的，箭头函数向上查找作用域，此时父级作用域也没有this，`注意父级作用域指的是函数作用域，对象没有作用域, `，于是继续向上查找到了window, 之前说了这里的a也是取不到的所以结果就是undefined。

## 没有arguments
没有this的情况就说到这了，接下来我们看看没有arguments的情况。
```
let say = () => {
	console.log(arguments);
}
say(1, 2, 3);
```
结果会报`arguments is not defined`,那我们就是想要拿到这些参数呢？当然是有办法的

我们把参数变成一个数组传递进去不就好了。

```
let say = (...arguments) => {
	console.log(arguments);
}
say(1, 2, 3);
```

## 没有原型
```
let say = (...arguments) => {
	console.log(arguments);
}
console.log(say.prototype);// undefined
console.log(new say());//say is not a constructor
say(1, 2, 3);
```