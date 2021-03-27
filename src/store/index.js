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
    headers: ({ token }) => ({ headers: `Authorization: Token ${token}` }),
    isAuthenticated: ({ token }) => !!token
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setErrorMessage(state, message) {
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
        commit("setToken", token);
      } catch ({ response: { status } }) {
        if (status === 400) {
          commit("setErrorMessage", "Logowanie nie powiodło się.");
        } else {
          commit("setErrorMessage", `Nieznany błąd. Kod ${status}.`);
        }
      }
    },
    async register(
      { commit },
      {
        email,
        password,
        firstName: first_name,
        lastName: last_name,
        dateOfBirth: date_of_birth,
        phoneNumber: phone_number,
        address,
        isNew: is_new,
        isCottage: is_cottage
      }
    ) {
      try {
        await axios.post("api/v1/user/", {
          email,
          password,
          first_name,
          last_name,
          date_of_birth,
          phone_number,
          address,
          is_new,
          is_cottage
        });
        return { ok: true };
      } catch ({
        response: {
          data: { email, phone_number: phoneNumber },
          status
        }
      }) {
        if (status === 400) {
          commit("setErrorMessage", "Rejestracja nie powiodła się.");
          return {
            data: {
              email: email || [],
              phoneNumber: phoneNumber || []
            },
            ok: false
          };
        } else {
          commit("setErrorMessage", `Nieznany błąd. Kod ${status}.`);
          return {
            ok: false
          };
        }
      }
    },
    logout({ commit }) {
      commit("setToken", undefined);
    },
    wipeErrorMessage({ commit }) {
      commit("setErrorMessage", undefined);
    }
  },
  modules: {}
});
