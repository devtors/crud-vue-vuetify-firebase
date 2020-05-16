import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.use(firestorePlugin)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
