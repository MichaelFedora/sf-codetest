import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import moment from 'moment';

Validator.installDateTimeValidators(moment);
Vue.use(VeeValidate);

import './theme';

import AppComponent from './app/app';

console.log('Environment: ', process.env.NODE_ENV);

const v = new Vue({
  el: '#app',
  components: { AppComponent },
  render: h => h(AppComponent)
});
