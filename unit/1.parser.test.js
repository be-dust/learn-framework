import {parser, stringify} from './src/1.parser';

// 断言 
// describe就是用例的一个作用域
describe('分类1', () => {
    it('I want to test if the parser method is ok ? ', () => {
        expect(parser('name=zx&age=10')).toEqual({name: 'zx', age: '10'});
    });
})

describe('分类2', () => {
    it('I want to test if the stringify method is ok ?' , () => {
        expect(stringify({name: 'zx', age: 10})).toEqual('name=zx&age=10');
    });
})


// Test Suites 套件 就是当前只有一个文件
// f 强制刷新没有通过的用例
// enter 默认全部重新执行
// o 表示根据git，只运行修改过的文件
// 