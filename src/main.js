import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router.js"; 
import "./firebase/firebase"; 
import { MotionPlugin } from "@vueuse/motion";

createApp(App).use(router).use(MotionPlugin).mount("#app");
