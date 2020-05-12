export const map = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
        let current = arr[i];
        fn(current, i);
    }
}