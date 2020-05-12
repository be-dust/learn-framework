const parser = (str) => {
    let obj = {};
    str.replace(/([^=&]+)=([^=&]+)/g, function() {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}

const stringify = (obj) => {
    const arr = [];
    for(let key in obj) {
        arr.push(`${key}=${obj[key]}`);
    }
    return arr.join('&');
}

export {
    parser,
    stringify
}

// 1. 测试代码会污染正常代码
// 2. 如果删除了就需要重写，别人也不知道自己写的代码是干什么的

// console.log(parser('name=zx&age=10'));// {name: zx, age: 10}
// console.log(stringify({name: 'zx', age: 10}));//'name=zx&age=10'