(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,// identify缩写，标识符的意思其实就是模块id
            l: false,// 是否已经加载
            exports: {}// 此模块的导出对象
        };
        // 获取模块对应的函数，然后开始调用
        // module.exports 就是this
        // 函数执行完就把module.exports赋了值
        // 所以module.exports === exports
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;// 设置为已加载
        return module.exports;// 返回模块对象
    }

    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    // 给一个对象增加一个属性 d 就是 defineProperty
    __webpack_require__.d = function (exports, name, getter) {
        // o就是hasOwnProperty
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    // 给exports定义一个_esModule属性,表示这是一个es模块
    // 后续需要把esModule转化为commonJS
    __webpack_require__.r = function (exports) {
        // es6才会有Symbol
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

    // 按位与 二进制 1:0001 2:0010 4:0100 8:1000,性能更好
    __webpack_require__.t = function (value, mode) {
        // 如果是从右向左第一位为1，表示value是模块id，需要通过require加载，把value赋值为模块的导出对象
        if (mode & 1) value = __webpack_require__(value);
        // 如果是从右向左第4位为1
        // 比如1000就直接返回
        // 比如1001 先走上面的require再返回
        if (mode & 8) return value;
        // 如果从右向左第三位是1, 表示这是一个esModule, 直接返回
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;

        // 既不是commonJS模块也不是es6模块就创建一个新对象，给它添加一个default属性
        var ns = Object.create(null);
        // 如果是支持es6就把它变为一个esModule
        __webpack_require__.r(ns);

        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        // 如果是0010，要把value的所有属性拷贝到ns上
        if (mode & 2 && typeof value != 'string') {
            for (var key in value) {
                __webpack_require__.d(ns, key,
                    function (key) { return value[key]; }.bind(null, key));
            }
        }
        return ns;
    };

    // 判断模块是什么规范的模块
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?// 根据是否是es Module返回不同的函数
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // 判断是否是自己身上的属性
    __webpack_require__.o = function (object, property) { 
        return Object.prototype.hasOwnProperty.call(object, property); 
    };

    // path
    __webpack_require__.p = "";

    var installedChunks = {
        "main": 0// 主代码块默认加载成功
    };
 	function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({"c":"c"}[chunkId]||chunkId) + ".js"
    }
    // 懒加载代码块
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];
        
        var installedChunkData = installedChunks[chunkId];

        if(installedChunkData !== 0) { // 说明不是主代码块
            if(installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {
                
                var promise = new Promise(function(resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });
                // [resolve, reject, promise]
                promises.push(installedChunkData[2] = promise);
    
                // JSONP
                var script = document.createElement('script');
                var onScriptComplete;
    
                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute("nonce", __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);// script.src = c.js
    
                
                var error = new Error();
                onScriptComplete = function (event) {
                    
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if(chunk !== 0) {
                        if(chunk) {
                            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                            var realSrc = event && event.target && event.target.src;
                            error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                            error.name = 'ChunkLoadError';
                            error.type = errorType;
                            error.request = realSrc;
                            chunk[1](error);
                        }
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function(){
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };

    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
    ({
        "./src/index.js":
            (function (module, exports, __webpack_require__) {
                let title = __webpack_require__("./src/title.js");
            }),
        "./src/title.js":
            (function (module, exports) {
                module.exports = 'title';
            })
    });

// modules的key是模块的相对于根目录的路径，value是一个函数
// require 变成了__webpack_require__


