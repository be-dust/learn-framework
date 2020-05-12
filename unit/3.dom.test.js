import {removeNode} from './src/2.dom';

// jest具备jsdom功能，会提供一个jsdom环境，在node中可以有dom的概念

it('测试能否正常删除dom节点', () => {
    document.body.innerHTML = `<div><button id="btn"></button></div>`;
    let btn = document.querySelector('#btn');
    expect(btn).not.toBeNull();
    removeNode(btn);
    btn = document.querySelector('#btn');
    expect(btn).toBeNull();
});