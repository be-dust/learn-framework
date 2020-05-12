export const timer = (fn) => {
    setTimeout(() => {
        fn({name: 'zx'});
    }, 5000);
}