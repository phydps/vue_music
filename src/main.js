import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import axios from 'axios'
import VueLazyload from "vue-lazyload"
import store from './store'

// 此引入配置规则见build/webpack.base.conf.js 38行
import 'common/stylus/index.styl'

// 取消页面延迟300毫秒
fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.prototype.$axios = axios

// 懒加载默认图片
Vue.use(VueLazyload, {
	loading: require('common/image/netClound.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
