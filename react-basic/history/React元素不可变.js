import React from 'react';
import ReactDOM from 'react-dom';

/**
 * React元素都是不可变对象 , 只能每次新创建一个jsx然后重新渲染，不能改之前的jsx
 * React只会更新必要的部分, 都是依靠dom diff来实现
 */

 function tick() {
     let element = <div>
         <p>时间：</p>
         <p>{new Date().toLocaleTimeString()}</p></div>;
     ReactDOM.render(
        element, document.getElementById('root')
     );
 }

 setInterval(tick, 1000);