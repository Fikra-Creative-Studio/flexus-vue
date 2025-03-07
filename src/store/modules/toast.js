export default {
  namespaced: true,
  state: {
    toasts: [],
  },
  mutations: {
    ADD_TOAST(state, toast) {
      state.toasts.push(toast);
    },
    REMOVE_TOAST(state) {
      state.toasts.shift();
    },
  },
  actions: {
    showToast({ commit }, { message, type = "success", duration = 3000 }) {
      commit("ADD_TOAST", { message, type });

      setTimeout(() => {
        commit("REMOVE_TOAST");
      }, duration);
    },
  },
};
