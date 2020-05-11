let max = 5;
let cacheQueue = [];
let count = 0;
let urls = [];

function request() {
	count++;
	fetch(urls.shift()).then(function() {
		count--;
		next();
	});
}
function sendRequest() {
	if (count > max) {
		cacheQueue.push(function() {
			request();
		});
	} else {
		request();
	}
}

function next() {
	cacheQueue.length && cacheQueue.shift()();
}

for (let i = 0; i < urls.length; i++) {
	sendRequest();
}