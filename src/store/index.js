import { createStore } from "vuex";
import VueCookies from "vue-cookies";
import toast from "./modules/toast";
import modal from "./modules/modal";

export default createStore({
  state: {
    empresaLogo: null,
    usuario: VueCookies.get("usuario"),
    token: VueCookies.get("token") || null,
  },
  getters: {
    getEmpresaLogo: state => state.empresaLogo,
    getUsuario(state) {
      return state.usuario || {};
    },
    getToken(state) {
      return state.token;
    },
  },
  mutations: {
    setEmpresaLogo(state, logo) {
      state.empresaLogo = logo;
    },
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
    updateEmpresaLogo({ commit }, logo) {
      commit("setEmpresaLogo", logo);
    },
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
    modal,
  },
});
