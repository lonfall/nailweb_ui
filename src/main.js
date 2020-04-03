// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App'
import store from './store'
import router from './router'
import axiox from './axios/http'
// import iview from 'iview'
// import 'iview/dist/styles/iview.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font-awesome-4.7.0/css/font-awesome.min.css'

Vue.prototype.$axiox = axiox

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(VueCookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
