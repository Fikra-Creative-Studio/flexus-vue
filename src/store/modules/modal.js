export default {
  namespaced: true,
  state: {
    isModalVisible: false,
    isSecondModalVisible: false,
  },
  getters: {
    isModalVisible(state) {
      return state.isModalVisible;
    },
    isSecondModalVisible(state) {
      return state.isSecondModalVisible;
    },
  },
  mutations: {
    openModal(state) {
      state.isModalVisible = true;
    },
    closeModal(state) {
      state.isModalVisible = false;
    },
    openSecondModal(state) {
      state.isSecondModalVisible = true;
    },
    closeSecondModal(state) {
      state.isSecondModalVisible = false;
    },
  },
  actions: {
    openModal({ commit }) {
      commit("openModal");
    },
    closeModal({ commit }) {
      commit("closeModal");
    },
    openSecondModal({ commit }) {
      commit("openSecondModal");
      document.querySelector(".layout").classList.add("layout--aside");
    },
    closeSecondModal({ commit }) {
      commit("closeSecondModal");
      document.querySelector(".layout").classList.remove("layout--aside");
    },
  },
};
