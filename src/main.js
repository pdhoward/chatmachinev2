//import '@babel/polyfill' // <- babel Polyfills
// 'whatwg-fetch' // <- Fetch API Polyfill

import Vue from 'vue'
import App from './Components/App/App.vue'

import config from './../config'

// NEED TO FIGURE OUT THESE SERVICE WORKERS
//import { register_service_worker } from './utils'
//register_service_worker() // <- register service worker, disable it, when running in development mode


Vue.prototype.config = config // <- set config to global scope
console.log(`>>>>>>>>>>>>>>>>>>>>>STARTING UP<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
/* (global) This code is going to tell us, if history mode can be activated on the client, so the application can be consumed without localstorage */
Vue.prototype.history = () => {
    try {
        localStorage.getItem('check')
        return true
    }

    catch {
        return false
    }
}

/* (global) Currently selected language or fallback language (en). Needs to be a function, since it's reactive. No need for vuex there */
Vue.prototype.lang = () => {
    if(Vue.prototype.history()) return localStorage.getItem('lang') || config.app.fallback_lang

    else {
        return config.app.fallback_lang
    }
}

// global function to set scroll to bottom of chatwindow
Vue.prototype.$scrollTo = (chat) => {   
    window.scrollTo(0, chat + 30 );    ;
  }


new Vue({
    el: '#app',
    render: h => h(App)
}).$mount('#app')