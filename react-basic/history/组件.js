import React from 'react';
import ReactDOM from 'react-dom';

/*
如何定义组件 和组件的属性
1. 函数式组件： 就是一个函数, 接收一个属性对象，返回一个react元素
2. 类组件： 就是一个类, 类里有一个render方法，这个方法返回一个并且仅能返回一个顶级React元素
*/


/**
 * 组件的渲染
 * React元素不但可以是DOM标签，还可以是用户自定义的组件
 * 1. 类组件和函数组件首字母必须大写，React是通过首字母来区分自定义组件（大写）和原生DOM组件（小写）
 * 2. 组件必须先定义再使用
 * 3. 必选只能返回一个顶级元素
 * 4. props具有只读性： 1）不能改变输入的参数 2）如果输入相同，输出也相同
 */

 /**
  * 如何渲染函数组件
  * 1. 封装函数组件的属性对象 props = {name: 'title'}
  * 2. 把props传递给Welcome1这个函数，返回一个React元素
  * 3. 把这个React元素，也就是虚拟DOM渲染到真是DOM上
  * @param {} props 
  */

  /**
   * 1. 封装属性对象 props={name: 'title'}
   * 2. new Welcome2(props); 创建一个实例，传递props
   * 3. 调用实例的render方法，得到返回的React元素
   * 4. 把这个React元素，也就是虚拟DOM渲染到真是DOM上
   * @param {*} props 
   */

function Welcome1(props) {
    return <h1>hello {props.name}</h1>
}

class Welcome2 extends React.Component {
    // constructor(props) {
    //     super(props); 父类中已经写了 this.props = props
    // }
    render() {
        return <h1>hello {this.props.name}</h1>
    }
}

// let element = <Welcome1 name="title" />
// ReactDOM.render(element, document.getElementById('root'));


let element2 = <Welcome2 name="world" />
ReactDOM.render(element2, document.getElementById('root'));