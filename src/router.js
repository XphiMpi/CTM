import { createRouter, createWebHistory } from "vue-router";

import RoleSelect from "./views/RoleSelect.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Dashboard from "./views/Dashboard.vue";
import Mockup from "./views/Mockup.vue";


const routes = [
  { path: "/", component: Mockup },
  { path: "/RoleSelect", component: RoleSelect },
  { path: "/login/:role", component: Login },
  { path: "/register/:role", component: Register },
  { path: "/dashboard", component: Dashboard },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
