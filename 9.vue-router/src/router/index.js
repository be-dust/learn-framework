import Vue from 'vue'
import VueRouter from '../vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ '../views/About.vue'),
      children: [
        {
          path: 'a',
          component: {
            render(h) { return <h1> this is about / a </h1>}
          }
        },
        {
            path: 'b',
            component: { 
              render(h) { return <h1> this is about / b </h1> }
            }
        }
      ]
    }]

    const router = new VueRouter({
      routes
    });

    // vue路由钩子的实现， 也就是回调函数 和 express 框架的逻辑是一样的
    router.beforeEach((from, to, next) => {
      console.log(1);
      setTimeout(() => {
        next();
      }, 1000);
    });
    router.beforeEach((from, to, next) => {
      console.log(2);
      setTimeout(() => {
        next();
      }, 1000);
    });

    export default router