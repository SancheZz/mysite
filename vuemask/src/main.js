import Vue from 'vue';
import VueMask from '@yasanchezz/vue-mask';
import '@yasanchezz/vue-mask/dist/vue-mask.css';
import App from './App.vue';

if (process.env.NODE_ENV === 'production') {
  import('./metrika.js');
}

Vue.use(VueMask);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
