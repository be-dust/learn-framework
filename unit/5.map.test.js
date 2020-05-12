import {map} from './src/4.map';

it ('测试Map方法', () => {
    let fn = jest.fn();
    map([1, 2, 3],fn);
    expect(fn.mock.calls[0][0]).toBe(1);
    expect(fn.mock.calls[1][0]).toBe(2);
    expect(fn.mock.calls[2][0]).toBe(3);
});