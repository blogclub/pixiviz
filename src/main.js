import Vue from 'vue';

// Import dependencies
import qs from 'qs';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import VueLazyload from 'vue-lazyload';
import Vue2TouchEvents from 'vue2-touch-events';
import VueContextMenu from 'vue-context-menu';
import InfiniteLoading from 'vue-infinite-loading';

// Import element ui and styles

import './plugins/element.js';
import './styles/main.less';
import './util/extends.js';

// Import store
import store from './store';

// Import view and router
import App from './App.vue';
import router from './router';

// Import ver file
import { version } from './version';

// Import sw
import './registerServiceWorker';

Vue.config.productionTip = false;

// Set up axios
axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [
  function(data) {
    return qs.stringify(data, {
      arrayFormat: 'brackets',
    });
  },
];

Vue.prototype.axios = axios;
Vue.prototype.$http = axios;

// Set up lazyload
Vue.use(VueLazyload, {
  // set observer to true
  observer: true,
  // optional
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1,
  },
});

// Mobile events
Vue.use(Vue2TouchEvents);

// Set up things for waterfall
Vue.use(InfiniteLoading, {
  slots: {
    noResults: '这里没有图片...',
    noMore: '没有更多图片了...',
  },
});

// Set up vue cookies
Vue.use(VueCookies);
Vue.$cookies.config('7d');

// Set up context menu
Vue.use(VueContextMenu, {
  useItem: true,
  mobileSupport: false,
});

// 获取下载设置
const downloadSettings = window.localStorage.getItem('download-settings');
if (downloadSettings) {
  try {
    Vue.prototype.$downloadSettings = JSON.parse(downloadSettings);
  } catch (err) {
    console.error('Cannot parse download settings.', err);
  }
} else {
  Vue.prototype.$downloadSettings = {
    singleFileName: '{title}-{id}',
    multiFileName: '{title}-{id}-{index}',
  };
}

// Set up bus
Vue.prototype.$bus = new Vue();

// hmt
_hmt.push(['_setCustomVar', 1, 'appVer', version, 2]);

new Vue({
  router,
  store,
  render: (h) => h(App),
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  },
}).$mount('#app');
