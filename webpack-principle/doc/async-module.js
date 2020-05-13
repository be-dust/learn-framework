(function (modules) {
    // 通过JSONP获取回来的新的模块定义合并到modules对象上，方便下面的模块加载
    // 让promise变为成功态
    /* 
    // c.js被请求回来后就执行了window["webpackJsonp"].push()方法
    (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["c"], {
        "./src/c.js": (function (module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_exports__["default"] = ({
                name: 'zx'
            });
        })
    }]); */
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];// ["c"], 一个代码块内部可能会加载另外的模块
        var moreModules = data[1];// 新的模块的定义
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);// 把所有
            }
            // 在这之前installedChunkData = installedChunks[chunkId] = [resolve, reject, promise]
            installedChunks[chunkId] = 0;// 标识代码块已经加载
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];// modules = {index.js, c.js}
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);
        // 挨个执行resolve方法,把所有promise变为成功态
        while (resolves.length) {
            resolves.shift()();
        }
    };
    var installedModules = {};
    var installedChunks = {
        "main": 0
    };
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({ "c": "c" }[chunkId] || chunkId) + ".js"
    }
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    // 懒加载代码块
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];
        var installedChunkData = installedChunks[chunkId];
        if (installedChunkData !== 0) {// 说明还没有加载成功，有可能上一次用到的模块又被用到
            if (installedChunkData) {// 如果还没被加载并且有值，说明这个模块正在加载中，加载完成后的值就是0了
                promises.push(installedChunkData[2]);
            } else {
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });
                // [resolve, reject, promise]
                promises.push(installedChunkData[2] = promise);
                var script = document.createElement('script');
                var onScriptComplete;
                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute("nonce", __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);
                var error = new Error();
                onScriptComplete = function (event) {
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if (chunk !== 0) {
                        if (chunk) {
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
                var timeout = setTimeout(function () {
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                // 这一步之后就会去请求异步加载的模块，请求完成后就会执行webpackJsonpCallback方法，这个方法内部会进行模块的合并，合并成功后就把promise状态置为成功
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);// 所有的模块都合并完之后，执行__webpack_require__方法加载该模块
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    __webpack_require__.p = "";
    __webpack_require__.oe = function (err) { console.error(err); throw err; };
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;// 重写了jsonpArray.push方法
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
    ({
        "./src/index.js":
            (function (module, exports, __webpack_require__) {
                let loadC = document.getElementById("loadC");
                loadC.onclick = function () {
                    __webpack_require__.e("c").then(__webpack_require__.bind(null, "./src/c.js")).then(c => {
                        console.log(c);
                    });
                }
            })
    });