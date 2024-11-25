import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import './plugins/helper'
import VueHtmlToPaper from 'vue-html-to-paper';

Vue.config.productionTip = false
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  "timeout": 1000,
  "autoClose": true,
  "windowTitle": "Vue Html To Paper - Vue mixin for html elements printing."
}

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

