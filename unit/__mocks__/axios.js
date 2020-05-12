export default {
    get(url) {
        return new Promise((resolve, reject) => {
            if (url === '/user') {
                resolve({name: 'zx'});
            }
            if (url === '/list') {
                resolve([1, 3, 4])
            }
        })
    },
    // post方法
    post() {

    }
}