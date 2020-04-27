// 两种调用方式
// 1. Message({type: 'success', message: 'xxx'});
// 2. Message.success({message: 'xxx'})；

import Vue from 'vue';
import MessageCom from './Message';

// 所有组件的初始化都要先拿到对应的构造函数
let messageConstructor = Vue.extend(MessageCom);// Vue.extend方法:先拿到父类Vue，做缓存，构造一个子类Vue继承父类Vue， 返回的就是这个子类

// 这个就是两种调用方式统一的入口
const Message = (options) => {
    let instance = new messageConstructor({
        data: options// 传递用户选项
    });
    instance.$mount();// 表示挂载组件，真实dom放在了instance.$el上用来手动挂载dom
    document.body.appendChild(instance.$el);

    instance.visible = true;// 显示到页面时加上动画
}

['success', 'error', 'warning'].forEach(type => {
    Message[type] = function (options) {
        options.type = type;
        return Message(options);
    }
})

export {Message}