// 解构赋值  结构相同可以把解构中的数据获取到

// let [a, b] = [1, 2, 3];
// let [, a, b] = [1, 2, 3]; 

// 剩余运算符, 只能用到最后一个参数中
// let [, ...args] = [1, 2, 3];

// es6语法中默认值就是 = , 通过 : 来改名字
// let {name, age} = {name: 'zx', age: 25};
// let {name, age1 = 10} = {name: 'zx', age: 25};
// let {name, age1 = 10, age: age2} = {name: 'zx', age: 25};
// console.log(name, age1, age2);

// let {a, b, c} = {a:1, b:2, c:3};
// let {b, ...obj} = {a:1, b:2, c:3};
// console.log(obj);

