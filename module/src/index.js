es6中的模块 

import是静态导入，所谓静态导入就是在最外层作用域下使用

同步执行，有变量提升的作用，写法
```
import xx from 'xx';
```

require 动态导入：
if (true) {
	require('xxx');
} 

模块的概念：为了保证多个模块之间相互独立 核心是解决变量冲突问题  方便维护  单例模式
把当前的内容 放到一个函数中
import / export(es6中每个文件就是一个模块)

可以一个一个拿， 可以取别名，可以通过接口实时拿到最新的值

import * as obj from './a';
import {str1 as str3} from './a';

import {str} from './a';
setInterval(() => {
	console.log(str);
}, 1000);

if (true) {
	import('./video').then(data => {
		console.log(data.default);// data相当于是 * as data
	});// import()返回的是promise, 动态导入某个文件 草案语法， 需要插件
}