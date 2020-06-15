import React from 'react';
import ReactDOM from 'react-dom';


// function greeting(name) {
//     if (name) {
//         return <h1>hello {name}</h1>
//     } else {
//         return <h1>hello stranger</h1>
//     }
// }
// let element = greeting('zx');

let names = ['zhangsan', 'lisi', 'wangwu'];
let elements = names.map(item => {
    return <li key={item}>{item}</li>
});
ReactDOM.render(
    <ul>
        {elements}
    </ul>, document.getElementById('root'));