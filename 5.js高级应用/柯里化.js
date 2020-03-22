## 柯里化
什么是函数的柯里化？

说的绕点就是一个函数原本有多个参数，现在构造一个加工函数，最终生成一个只传入一个参数的新函数，这个加工函数来接收剩下的参数，高阶函数还是高阶函数。

听着挺高大上，其实就是把一个复杂的函数变的简单点，表现就是参数变成了一个，

定义一个有多个参数的函数
```
function add (a, b, c, d) {
	return a+b+c+d;
}
```
我们要把它变成参数只有一个的新函数，怎么做呢?
```
function curring(fn, ...args) {
	if (fn.length === args.length) {
		return fn(...args);
	} else {
		return function(...values) {
			let newArgs = [...args, ...values];
			return curring(fn, ...newArgs);
		}
	}
}
```
注意当参数小于原函数的参数个数的时候使用了递归来生成新的函数或者结果。
```
let fn = curring(add, 1, 2);
let newFn = fn(3);
console.log(newFn(4));
```
看到这你可能会想我们平时也不会这么写代码，所以柯里化的意义是什么？ok，我们看一看Vue中对柯里化的经典使用吧。

在Vue中，每一个标签可以是真正的HTML标签，也可以是自定义组件，那怎么区分？

需要一个函数，判断一个标签是否为内置的标签

```
function isHTMLTag(tagName, tags) {
    tagName = tagName.toLowerCase();
    for (...) {
        if (tagName === tags[i]) return true;
    }
    return false;
}
```
假设只有这6种标签：
```
let tags = 'div, p, a, img, ul, li'.split(',');
```

模板是任意编写的，可以很简单也可以很复杂。如果只有这6种内置标签，而模板中有10个标签需要判断，那么就需要执行60次循环，显然性能十分低下，再看看使用柯里化后的效果
```
function makeMap(keys) {
	let set = {};// 闭包
	keys.forEach(key => {
		set[key] = true
	});
	return function (tagName) {
		return !!set[tagName.toLowerCase()];
	}
}

let tags = 'div, p, a, img, ul, li'.split(',');
let isHTMLTag = makeMap(tags);
```
这样使用柯里化的思想缓存了一部分行为，我们无需再去写循环遍历判断，上面的情况只需要10次判断即可，提升了性能，也让代码更加简洁。

## 反柯里化

与柯里化相反的是反柯里化，当然不是说让一个简单的函数变得复杂点，这听着就不合理，正确的说法应该是让一个函数的应用范围变得更广。

我们经常在判断类型的时候会用到一个方法 
```
Object.prototype.toString.call('hello')
```
问题是`toString`只能用`Object.prototype`来调用，我们每次判断类型都要写这么长太难受了吧，这个时候我们就可以通过反柯里化的思想来解决这个问题:
```
function unCurrying(fn) {
	return function(...args) {
		return fn.call(...args);
	}
}

let toString = unCurrying(Object.prototype.toString);
```
这样我们就不用每次写那么长的代码，toSting彻底从Object.prototype下解放了,试试吧
```
console.log(toString('hello'));
```

## 偏函数

其实和柯里化相近的还有一个偏函数：它的核心逻辑是接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。这个定制化的函数不需要像柯里化一样一定只要一个参数。它的目的是把一些有相同规律的函数变成一个通用的函数，这样使用起来更加方便，比如还是判数据类型的例子，可以写如下的判断逻辑:
```
let isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]';
};
let isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]';
};
let isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
let isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]';
};
// ...
```
可以看到，出现了非常多重复的逻辑。我们将它们做一下封装:
```
let isType = (type) => {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  }
}
```
现在我们这样做即可:
```
let isString = isType('String');
let isFunction = isType('Function');
//...
```
相应的 isString和isFunction是由isType生产出来的函数，但它们依然可以判断出参数是否为String（Function），而且代码简洁了不少。
```
isString("123");
isFunction(val => val);
```
isType这样的函数我们便称之为偏函数
