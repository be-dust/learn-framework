import {timer} from './src/7.timer';
jest.useFakeTimers();// 使用模拟时间

it ('测试5s后能否返回name: zx', () => {
    let fn = jest.fn();
    timer(fn);
    // jest.runAllTimers();// 默认会立即执行，但是如果写的是setInterval就会陷入死循环

    // jest.advanceTimersByTime(12000;// 前进时间，看看12s里fn执行了几次
    // expect(fn.mock.calls.length).toBe(3);
    jest.runOnlyPendingTimers();// 只运行第一次
    expect(fn.mock.calls.length).toBe(1);
}); 