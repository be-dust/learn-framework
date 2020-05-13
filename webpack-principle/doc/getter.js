// 获取器
let ageValue;
let obj = {};
Object.defineProperty(obj, 'age', {
    // value: 10,// 不能和get set共存
    get() {
        return ageValue;
    },
    set(newValue) {
        ageValue = newValue;
    },
    // writable: true,// 是否可以修改 不能和get set共存
    enumerable: true, // 是否可以枚举
    configurable: true// 是否可以删除
});

// value和writable get和set分别是一对