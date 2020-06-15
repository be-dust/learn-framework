import { createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import promise from 'redux-promise';// 中间件 派发promise
import thunk from 'redux-thunk';// 中间件 派发函数
import { routerMiddleware } from 'connected-react-router';
import history from '@/history';
import rootReducer from './reducers';
// let store = createStore()

let store = applyMiddleware(promise, thunk, logger)(createStore)(rootReducer);

export default store;