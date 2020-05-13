
/* let title = require('./title');
console.log(title.default);
console.log(title.age); */


/*  import name, {age} from './title';
 console.log(name);
 console.log(age); */

/*  import title from './title';
 console.log(title.name);
 console.log(title.age); */

/*  import('./c').then(c => {
     console.log(c);
 }); */

 let loadC = document.getElementById("loadC");
 loadC.onclick = function() {
    // 可以添加魔法注释，指定打包后的模块名称, 不加注释的话就会有一个默认的命名
    // 遇到import关键字做代码分割，把要导入的模块作为一个单独的模块
    import(/*webpackChunkName: "c"*/'./c').then(c => {
        console.log(c);
    });
 }
