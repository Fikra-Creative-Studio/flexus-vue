import { createStore } from "vuex";
import VueCookies from "vue-cookies";
import toast from "./modules/toast";

export default createStore({
  state: {
    usuario: VueCookies.get("usuario"),
    token: VueCookies.get("token") || null,
  },
  getters: {
    getUsuario(state) {
      return state.usuario || {};
    },
    getToken(state) {
      return state.token;
    },
  },
  mutations: {
    setUsuario(state, usuario) {
      state.usuario = usuario;
      VueCookies.set("usuario", JSON.stringify(usuario));
    },
    setToken(state, token) {
      state.token = token;
      VueCookies.set("token", token);
    },
    logout(state) {
      location.reload();
      VueCookies.remove("usuario");
      VueCookies.remove("token");
      state.usuario = null;
      state.token = null;
    },
  },
  actions: {
    login({ commit }, { usuario, token }) {
      commit("setUsuario", usuario);
      commit("setToken", token);
    },
    logout({ commit }) {
      commit("logout");
    },
    formatSelect:
      () =>
      (array = [], keyName, keyValue) => {
        if (!Array.isArray(array)) {
          return [];
        }

        return array.map(item => ({
          name: item[keyName] ?? "",
          value: item[keyValue] ?? "",
        }));
      },
  },
  modules: {
    toast,
  },
});
