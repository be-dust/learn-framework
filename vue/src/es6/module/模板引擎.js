// ejs  handlerbar jade underscore

实现一个es6 模板字符
原生字符串拼接 问题：不能换行

let name = 'zhangxing';
let age = '25';
let str = "${name}今年${age}岁了";
str = str.replace(/\$\{(.+?)\}/g, function() {// ?表示取消贪婪
	return eval(arguments[1]);
}); 
console.log(str);



// function render(html, obj) {
// 	return html.replace(/<%=(.+?)%>/g, function() {
// 		return obj[arguments[1]];
// 	});
// }

其实模板引擎的核心也就是这么个玩法，用正则来匹配然后替换成我们想要的样子，它的具体原理是：
1. 字符串拼接拿到想要的结果
2. with来实现作用域限制
3. new Function 来执行脚本

我们用ejs来举例，具体模板长这个样子
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<%arr.forEach(item=>{%>
		<h1><%=item%></h1>
	<%})%>
</body>
</html>
```
其中最关键的就是这一段
```
<%arr.forEach(item=>{%>
	<h1><%=item%></h1>
<%})%>
```
首先我们要把字符串拼接成我们想要的样子，就像下面这样
```
let str = '' 
str = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	`

arr.forEach(item=>{
str+=`
		<h1>${item}</h1>
	`
})

str+=`
</body>
</html>`"
```
把原模板分成了3份，然后我们用with来指定作用域 

```
let str = '' 
with(obj){ 
 str = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	`
arr.forEach(item=>{
str+=`
		<h1>${item}</h1>
	`
})
str+=`
</body>
</html>`
 } 
```
把上面的字符串末尾再加上`return str`，最终的样子就是
```

let str = '' 
with(obj){ 
 str = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	`
arr.forEach(item=>{
str+=`
		<h1>${item}</h1>
	`
})
str+=`
</body>
</html>`
 } 
 return str
```
最后把上面的字符串作为函数体在创建一个方法,这个方法应该是这个样子
```
function (obj) {
	let str = '' 
	with(obj){ 
	str = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
	</head>
	<body>
		`
	arr.forEach(item=>{
	str+=`
			<h1>${item}</h1>
		`
	})
	str+=`
	</body>
	</html>`
 } 
 return str
}
```
然后传入参数执行得到结果,下面是代码实现
```
let fs = require('fs');

let template = fs.readFileSync('./index.html', 'utf8');

function render(template, renderObj) {
	let head = "let str = '' \r\nwith(obj){ \r\n str = `"
	template = template.replace(/<%=(.+?)%>/g, function() {
		return '${' + arguments[1] + '}';
	});
	let content = template.replace(/<%(.+?)%>/g, function() {
		return '`\r\n' + arguments[1] + '\r\nstr+=`';
	});
	let tail = '`\r\n } \r\n return str';
	return new Function ('obj', head + content + tail)(renderObj);
}

let r = render(template, {arr: [1, 3, 4]});
console.log(r);
```
