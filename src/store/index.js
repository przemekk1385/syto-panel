import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errorMessage: undefined,
    token: undefined
  },
  getters: {
    isAuthenticated: ({ token }) => !!token
  },
  mutations: {
    setToken(state, { token }) {
      state.token = token;
    },
    setErrorMessage(state, { message }) {
      state.errorMessage = message;
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const tokenPromise = await axios.post("/api-token-auth/", {
          username,
          password
        });
        const { token } = tokenPromise?.data;
        commit("setToken", { token });
      } catch ({ response: { status } }) {
        if (status === 400) {
          commit("setErrorMessage", { message: "Logowanie nie powiodło się." });
        } else {
          commit("setErrorMessage", {
            message: `Nieznany błąd. Kod ${status}.`
          });
        }
      }
    },
    logout({ commit }) {
      commit("setToken", { token: undefined });
    },
    wipeErrorMessage({ commit }) {
      commit("setErrorMessage", { message: undefined });
    }
  },
  modules: {}
});
