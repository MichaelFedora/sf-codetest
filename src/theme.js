import Vue from 'vue';
import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.css';

Vue.use(VueMaterial);

export default Vue.material.registerTheme({
 default: {
    primary: 'blue',
    accent: 'pink',
    warn: 'deep-orange',
    background: 'white'
  }
});
