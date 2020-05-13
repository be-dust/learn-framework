import Counter from './src/6.counter';

let counter;

describe('作用域', () => {
    // 可以放下面的钩子，这样的话钩子只对这个作用域下的用例有效
});

beforeEach(() => {// 每个用例执行前都会执行此方法
    counter = new Counter();
});

afterEach(() => {// 每个用例执行后都会执行此方法
    console.log('afterEach');
});

beforeAll(() => {// 只走一次
    console.log('beforeAll');
});

afterAll(() => {// 只走一次
    console.log('afterAll');
});


// 希望用例之间没有任何关系
it ('测试加5', () => {
    // let counter = new Counter();// 每个用例都写了一遍,麻烦,可以用beforeEach解决
    counter.add(5);
    expect(counter.count).toBe(5);
});


it ('测试减5', () => {
    // let counter = new Counter();
    counter.minus(5);
    expect(counter.count).toBe(-5);
});

it ('测试加5,减5', () => {
    // let counter = new Counter();
    counter.add(5).minus(5);
    expect(counter.count).toBe(0);
});