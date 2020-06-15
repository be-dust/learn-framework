import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * 如果对属性进行类型校验
 * 组件是封装好给别人用的
 * 类型检查为什么要用静态的？
 * 1. 使用方便Person.propTypes
 * 2. 只会有一份，节约内存，否则每new一个实例都要创建一份
 */

class Person extends React.Component {
    static defaultProps = {
        name: '默认'
    }
    static propTypes = {
        name: PropTypes.string.isRequired,// 字符串，必传
        gender: PropTypes.oneOf(['male', 'female']),
        hobby: PropTypes.arrayOf(PropTypes.string),// 字符串数组
        position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        // 属性对象 属性名称 组件的名称, 这是一个自定义的校验器
        age(props, propName, componentName) {
            let age = props[propName];
            if (age < 0 || age > 120) {
                throw new Error('Invalid prop age');
            }
        }
    }
    render() {
        let { name, age, gender, hobby, position, friends } = this.props;
        return <table>
            <thread>
                <tr>
                    <td>姓名</td>
                    <td>年龄</td>
                    <td>性别</td>
                    <td>爱好</td>
                    <td>位置</td>
                </tr>
            </thread>
            <tbody>
                <tr>
                    <td>{name}</td>
                    <td>{age}</td>
                    <td>{gender}</td>
                    <td>{hobby}</td>
                    <td>{`x: ${position.x}, y: ${position.y}`}</td>
                </tr>
            </tbody>
        </table>
    }
}

let props = {
    name: 'zxx',
    age: 80,
    gender: 'male',
    hobby: ['smoking', 'drinking'],
    position: { x: 10, y: 10 },
    friends: [
        { name: 'zhangsan', age: 30 },
        { name: 'lisi', age: 40 }
    ]
}

let element = <Person {...props} />

ReactDOM.render(element, document.getElementById('root'));