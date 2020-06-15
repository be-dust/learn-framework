import React from 'react';
import ReactDOM from 'react-dom';

/*
JSX，看上去是html，实际上会被babel转为js代码，比如const element = <h1>hello</h1>, 
会被转为
const element = React.createElement("h1", null, "Hello, world!"); element就是一个对象，也就是React中的虚拟DOM
*/

/*
React元素
是React应用的最小单位，描述了我们再屏幕上看到的内容。它的本质是一个普通的js对象， ReactDOM会保证浏览器
中的DOM和我们的React元素一致
*/

/*
JSX表达式
变量和操作符的集合
表达式要放在括号里
< 开头就是JSX元素  {}就是表达式
给JSX赋值的时候避免使用JS关键字: class->className for->htmlFor
JSX也是一个js对象
*/

// let element = <h1>hello</h1>;
// console.log(element);

// let element = createElement('h1', {id: 'title'}, 'hello', createElement('h2', null, 'world'));
// console.log(element);


let name = 'hello';

ReactDOM.render(<h1 id="title" className="wel">hello {name}</h1>, document.getElementById('root'));