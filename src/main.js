import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// oruga

//import { Oruga } from '@oruga-ui/oruga-next'
//import '@oruga-ui/oruga-next/dist/oruga-full.css'

createApp(App).use(createPinia()).use(router).use(Oruga).mount('#app')