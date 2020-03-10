
这个方法我猜很多人一听就头大，反正只要扯上循环、递归就觉得复杂，其实真没那么复杂，它的核心就是把一个数组转化成一个值，专业点叫收敛，无非就两个参数：

1. 第一个是一个累积函数，这个函数有4个参数，前两个分别是累积的前一项和后一项，第三个是当前循环的索引项，第四个是当前的数组，后两个基本上用不到。
2. 第二个是一个预设值，当然这个预设值可有可无，如果有的话就作为第一项传递给累积函数。
```
[1,2,3].reduce((pre, next, index, current) => {
	return pre + next;
});
```
上面的代码会执行两次循环，第一次循环index是1， 第二次循环index是2。

再看一个复杂的例子
```
let r = [{count: 3, price: 5}, {count: 3, price: 5}, {count: 3, price: 5}].reduce((prev, next) => {
	return prev.count * prev.price + next.count*next.price;
});
console.log(r)
```

r的值是NaN, 因为第二次循环时prev是30，30没有count和price属性

那怎么解决呢？可以写成下面的样子
```
let r = [{count: 3, price: 5}, {count: 3, price: 5}, {count: 3, price: 5}].reduce((prev, next) => {
	return prev + next.count*next.price;
}, 0);
console.log(r);
```
给reduce函数传了一个预设值，累积函数的第一项始终是一个数值。

说了这么多我们具体来看看reduce的应用吧

### 1. 用reduce来实现数组的扁平化

所谓扁平化就是把一个多维的数组转化成一个一维数组
```
function flatten(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}
let ary = [1, 2, [3, 4], [5, [6, 7]]]
console.log(flatten(ary));
```
试试吧~

### compose 
组合函数, 就是把多个函数组合在一起，其实这是一种面向组合的编程方式，比面向对象更加灵活

先写3个函数
```
function sum(a, b) {
	return a + b;
}

// 求上一次结果的长度
function len(str) {
	return str.length;
}

function addCurrency(str) {
	return '$' + str;
}
```
如果我么不使用compose势必会写出下满的代码
```
len(sum('xyz', 'mpq'));
```
如果函数很多就需要一层一层的嵌套，简直low爆了, 再看一看compose的实现吧
```
compose(len, sum)('abc', 'mpq');
```
没有那么多的嵌套，只需要按照顺序写就好了。下面就使用reduce来具体实现这个compose函数：
```
function compose(...fns) {
	return function(...args) {
		let lastFnResult = fns.pop();
		// 从右向左
		return fns.reduceRight((prev, next) => {
			return next(prev);
		}, lastFnResult(...args));
	}
}
```
思路就是拿到最后一个fn，执行之后把结果传递给上一个函数，就这么走下去直到最后返回最终结果。

改成箭头函数, 不写return就不写大括号
```
let compose = (...fns) => (...args) => {
		let lastFnResult = fns.pop();
		return fns.reduceRight((prev, next) => next(prev), lastFnResult(...args));
}
```

上面是逆向写的, 把函数倒序一个一个的执行, 现在我们把它改成正向的
```
function compose(...fns) {
	return fns.reduce((prev, next) => {
		return function (...args) { 
			return prev(next(...args));
		}
	});
}
```
简化之后
```
let compose = (...fns) => fns.reduce((a,b) => (...args) => a(b(...args)));
```
所以下次看到别人写的牛x哄哄的代码不要被吓着，其实就是这么回事。跑下测试吧
```
let r = compose(addCurrency, len, sum)('abc', 'def');
console.log(r);
```

上面的代码看上去简单，其实还是挺绕的，我们拆解一下其中的过程:

reduce第一次运行得到的结果，返回一个函数
```
function (...args) {
	return addCurrency(len(...args));
}
```
第二次运行, prev就是上面的函数, next就是sum, 代入之后就是
```
return function (...args) { 
	return function (...args) {
		return addCurrency(len(...args));
	}(sum(...args));
}
```
看出来了吗，最后一次产生了一个自执行函数

自执行函数执行后的结果就是
```
return function (...args) { 
	return addCurrency(len(sum(...args)))；
}
```
最终还是回到那种low爆的形式，当然我们不用手动去写。