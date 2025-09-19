import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/styles/main.css";
import { useRatesStore } from "@/stores/rates";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Inicializar suscripción a tasas de cambio automáticamente
const ratesStore = useRatesStore();
ratesStore.start();

app.mount("#app");
