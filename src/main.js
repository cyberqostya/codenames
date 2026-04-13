import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "@/styles/global.scss";
import { initTelegramApp } from "@/utils/telegram";
import { registerServiceWorker } from "@/utils/serviceWorker";

initTelegramApp();
registerServiceWorker();

const app = createApp(App);

app.use(createPinia());
app.mount("#app");
