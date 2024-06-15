import { createApp } from 'vue'
import { Quasar, Dialog } from 'quasar'
import router from './router'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

import 'quasar/src/css/index.sass'
import './style.css'

import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Dialog
  }, // import Quasar plugins and add here
})
myApp.use(router)

myApp.mount('#app')
