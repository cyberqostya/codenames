import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "@/styles/global.scss";
import { initTelegramApp } from "@/utils/telegram";

initTelegramApp();

const app = createApp(App);

app.use(createPinia());
app.mount("#app");
