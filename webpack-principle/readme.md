

1. 内置Symbol.toStringTag属性，对应的值是字符串

## webpack
- 打包工具
- 各种各样的模块打包成js
  
```
npm i webpack webpack-cli -D
```

清除注释
```
([\/]\*.+?\*[\/]|//.+)
```
清除空行
```
^\s*(?=\r?$)\n
```
## 1. module.exports和exports有什么关系？
这两个东西本质上是一个东西
```js
例如下面的这个模块
"./src/title.js":
            (function (module, exports) {
                module.exports = 'title';
            })
```
再结合__webpack_require__方法
```js
...
var module = installedModules[moduleId] = {
            i: moduleId,// identify缩写，标识符的意思其实就是模块id
            l: false,// 是否已经加载
            exports: {}// 此模块的导出对象
        };
 modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 ...
```
很明显最终module.exports === exports == 'title',就是一个东西

## 2. webpack怎么处理不同规范的模块之间的互相引用？

比如有以下es规范代码:
```js
export default name = 'title_name';// 需要通过title.default而不是title.name获取
export const age = 'title_age';// 通过title.age
```
对应的打包后的结果就是：
```js
"./src/title.js": (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, "age", function() { return age; });
__webpack_exports__["default"] = (name = 'title_name');
const age = 'title_age';
})
```
1. 把导出模块定义标识为esModule 
2. 对于普通导出，给导出模块直接定义了一个age属性，值就是我们定义的值
3. 对于默认导出，给导出模块定义了一个default属性, 值就是我们定义的值
   
最终的导出模块就是 
```js
{
    default: 'title_name',
    age: 'title_age'
}
```

#### 使用require加载es Module
```js
let title = require('./title');
console.log(title.default);
console.log(title.age);
```
对应的打包后的结果就是：
```js
"./src/index.js": (function(module, exports, __webpack_require__) {
    let title = __webpack_require__("./src/title.js");
    console.log(title.default);
    console.log(title.age);
})
```
可以看到直接使用__webpack_require__做了导入。

#### 使用import加载es Module
```js
 import name, {age} from './title';
 console.log(name);
 console.log(age);
```
对应打包后的结果就是：
```js
"./src/title.js": (function(module, __webpack_exports__,__webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
 console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"]);
 console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"]);
})
```
可以看到把这个index.js这个模块也标识为了esModule，之后内部会分别获取default和age属性。

#### 使用import加载commonJS Module
比如有以下cjs规范代码:
```js
module.exports = {
    name: 'title_name',
    age: 'title_age'
}
```
对应打包后的结果就是：
```js
"./src/title.js": (function(module, exports) {
exports.name = 'title_name';
exports.age = 'title_age';
})
```
import加载代码：
```js
 import title from './title';
 console.log(title.name);
 console.log(title.age);
```
打包后的结果就是:
```js
"./src/index.js":
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);

console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.name);
console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.age);
 })

```
可以看到先把index.js这个模块标识为esModule,

使用`import title from './title';`导入的title模块无法知晓是什么规范的模块，因此需要做一层判断。

`_title__WEBPACK_IMPORTED_MODULE_0___default`是一个函数 , 给这个函数定义了一个a属性指向的就是
```
{
    name: 'title_name',
    age: 'title_age'
}
```

## 异步懒加载模块原理是什么？