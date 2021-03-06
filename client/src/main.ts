import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

app.use(router)

app.mount('#app')
