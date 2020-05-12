import {getDataCallback, getDataPromise} from './src/3.async';

// 默认不支持异步
it('测试回调函数', (done) => {
    getDataCallback((data) => {
        expect(data).toEqual({name: 'zx'});
        done();
    });
});

it('测试promise', async () => {
    let data = await getDataPromise();
    expect(data).toEqual({name: 'zx'});
});

// 异步函数测试，需要传入done方法或者返回promise