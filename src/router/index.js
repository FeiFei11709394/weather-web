import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// dev环境
// if (process.env.NODE_ENV === 'development') {
//路由导航冗余报错（路由重复）
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
// }

const Home = () => import("@/pages/home/Home");

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
            meta: {
                title: "首页",
            },
        },

    ]
});
