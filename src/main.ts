import { createApp } from 'vue'
import { Quasar, Loading, Notify, Dialog } from 'quasar'
import router from './router'
import store from './store'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Loading,
    Notify,
    Dialog
  }, // import Quasar plugins and add here
  config: {
    loading: {},
    notify: {}
  }
})

myApp.use(router)
myApp.use(store)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
