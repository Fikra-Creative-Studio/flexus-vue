import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { mask } from "vue-the-mask";
import axios from "axios";
import VueCookies from "vue-cookies";
import Swal from "sweetalert2";
const app = createApp(App);

app.directive("mask", mask);
app.use(store).use(router).use(VueCookies).mount("#app");

app.config.globalProperties.$http = axios.create({
  baseURL: "https://apidev.flexus.app.br/api",
});

app.config.globalProperties.$http.interceptors.request.use(
  config => {
    const token = VueCookies.get("token");
    if (
      token &&
      ![
        "/login",
        "/create",
        "/forgot-password",
        "/reset-password",
        "/confirm-account",
        "/confirmed-account",
      ].includes(config.url)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
app.config.globalProperties.$swal = Swal;

router.beforeEach((to, from, next) => {
  const token = VueCookies.get("token");
  const usuario = VueCookies.get("usuario");
  let nivelAcesso = 0;
  if (usuario) {
    try {
      nivelAcesso = usuario.nivelAcesso;
    } catch (e) {
      console.error("Erro ao parsear o cookie 'usuario':", e);
    }
  }

  if (
    !token &&
    ![
      "/login",
      "/create",
      "/forgot-password",
      "/reset-password",
      "/confirm-account",
      "/confirmed-account",
    ].includes(to.path)
  ) {
    next("/login");
  } else if (token && to.name === "users" && nivelAcesso < 5) {
    next("/");
  } else if (
    ((token && to.name === "companies") || to.name === "companies-users") &&
    nivelAcesso !== 10
  ) {
    next("/");
  } else {
    next();
  }
});
