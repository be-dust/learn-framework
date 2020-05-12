export const getDataCallback = (fn) => {
     setTimeout(() => {
         fn({name: 'zx'});
     }, 1000);
}

export const getDataPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({name: 'zx'});
        }, 1000);
    })
}