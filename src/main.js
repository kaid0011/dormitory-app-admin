import { createApp } from "vue";
import { Quasar, Dialog, Notify } from "quasar";
import router from "./router";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";

import "quasar/src/css/index.sass";
import "./style.css";

import App from "./App.vue";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
  },
});

// Fetch session from local storage
const session = JSON.parse(localStorage.getItem('session'));

if (session) {
  myApp.provide('session', session);
}

// Navigation guard to check access and session status
router.beforeEach((to, from, next) => {
  const accessAreas = JSON.parse(localStorage.getItem('accessAreas') || '[]');
  const requiredAccess = to.meta.accessArea;

  if (session && to.name === 'Authentication') {
    // Redirect to the first route (e.g., dashboard) if trying to access authentication page with an active session
    next({ name: 'Dashboard' });
  } else if (requiredAccess && !accessAreas.includes(requiredAccess)) {
    // Redirect to a not authorized page if access is not allowed and not already on the NotAuthorized page
    next({ name: 'NotAuthorized' });
  } else {
    next();
  }
});

myApp.use(router);

myApp.mount("#app");
