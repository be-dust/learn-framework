let toString = Object.prototype.toString;


let myExports = {};
// console.log(toString.call(myExports));// "[object Object]"

// Object.defineProperty(myExports, Symbol.toStringTag, {value: 'Module'});
// console.log(toString.call(myExports));// "[object Module]"

myExports = {[Symbol.toStringTag]: ' Module'};
console.log(toString.call(myExports));// "[object Module]"

function toString() {
    return `[object ${this[Symbol.toStringTag] || 'Object'}]`
}