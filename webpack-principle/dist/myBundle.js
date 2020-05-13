(function (modules) {
    var installModules = {};

    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // 创建一个新的模块并且赋给module并放到缓存中
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        }
        modules[moduleId].call(module.exports, modules, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }

    __webpack_require__.m = modules;
    __webpack_require__.c = installModules;
    // 给一个对象增加一个属性 d 就是 defineProperty
    __webpack_require__.d = function() {
        // o就是hasOwnProperty
        if(!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {})
        }
    }
})({
    "./src/index.js":
        (function (module, exports, __webpack_require__) {
            let title = __webpack_require__("./src/title.js");
        }),
    "./src/title.js":
        (function (module, exports) {
            module.exports = 'title';
        })
})

// modules的key是模块的相对路径，value是一个函数
// require 变成了__webpack_require__