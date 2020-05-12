import axios from 'axios';

export const fetchUser = () => {
    return axios.get('/user');
}

export const fetchList = () => {
    return axios.get('/list');
}

// 这个去需要mock
export const sum = (a, b) => {
    return a + b;
}