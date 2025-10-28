import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router/index.js';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css';
import "primeicons/primeicons.css";

const app = createApp(App)

app.use(router)

app.use(createPinia());

app.use(Toast, {
  position: 'top-right',
  toastDefaults: {
    success: { style: { background: '#16a34a', color: '#fff' } },
    error: { style: { background: '#dc2626', color: '#fff' } },
  },
});


app.mount('#app')
