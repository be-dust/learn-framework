// 匹配器 分成三类
// 1. 相等
// 2. 不相等
// 3. 是否包含

// 不同的写法会有相同的功能
it('相等用例', () => {
    expect(1+1).toBe(2);// ===
    expect({name: 'zx', age: 10}).toEqual({name: 'zx', age: 10});// 长的一样就行
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
});

it('不相等用例', () => {
    expect(1+1).not.toBe(3);
    expect(1+1).toBeLessThan(3);
    expect(1+1).toBeGreaterThan(1);
});

it('判断是否包含', () => {
    expect('hello').toContain('h');
    expect('hello').toMatch(/h/);
});
