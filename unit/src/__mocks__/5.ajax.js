
export const fetchUser = () => {
    return new Promise((resolve,reject) => resolve({name: 'zx'}));
}

export const fetchList = () => {
    return new Promise((resolve,reject) => resolve([1, 3, 4]));
}