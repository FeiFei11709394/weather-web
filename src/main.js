import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import * as api from "./restful/api";
// 手动引入 ECharts 各模块来减小打包体积

Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.prototype.$api = api;

Vue.prototype.setLocalValue = function(name, value) {
  if (window.localStorage) {
    localStorage.setItem(name, value);
  } else {
    alert("This browser does NOT support localStorage");
  }
};

Vue.prototype.getLocalValue = function(name) {
  const value = localStorage.getItem(name);
  if (value) {
    return value;
  } else {
    return "";
  }
};

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
});
