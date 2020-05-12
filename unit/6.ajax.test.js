jest.mock('./src/5.ajax.js');// 表示这个文件用假的，找在__mocks__下的同名文件
import {fetchUser, fetchList} from './src/5.ajax';

let {sum} = jest.requireActual('./src/5.ajax.js');// 没有mock的方法还需要用真实的方法

// 前端ajax请求需要mock掉
it ('测试能否获取客户', async () => {
    let r = await fetchUser();
    expect(r).toEqual({name: 'zx'});
});

it ('测试能否获取列表', async () => {
    let r = await fetchList();
    expect(r).toEqual([1, 3, 4]);
});

it ('测试求和', () => {
    expect(sum(1, 1)).toBe(2);// 假的文件里sum就找不到
});