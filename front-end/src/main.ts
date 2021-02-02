import { createApp } from 'vue'
import App from './App.vue'
import apolloPlugin from './plugins/apollo'
import router from './router'

createApp(App)
  .use(apolloPlugin)
  .use(router)
  .mount('#app')
