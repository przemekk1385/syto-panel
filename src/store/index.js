import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errorMessage: undefined,
    me: undefined,
    token: undefined
  },
  getters: {
    headers: ({ token }) => ({ headers: { Authorization: `Token ${token}` } }),
    isAuthenticated: ({ token }) => !!token,
    isCottageWorker: ({ me: { groups } } = { me: { groups: [] } }) =>
      groups.indexOf("cottage_worker") !== -1,
    isStationaryWorker: ({ me: { groups } } = { me: { groups: [] } }) =>
      groups.indexOf("stationary_worker") !== -1
  },
  mutations: {
    errorMessage(state, message) {
      state.errorMessage = message;
    },
    me(state, user) {
      state.me = user;
    },
    token(state, token) {
      state.token = token;
    }
  },
  actions: {
    async userCreate(
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
        response: { data: { email, phone_number: phoneNumber } = {}, status }
      }) {
        if (status === 400) {
          commit("errorMessage", "Rejestracja nie powiodła się.");
          return {
            data: {
              email: email || [],
              phoneNumber: phoneNumber || []
            },
            ok: false
          };
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
          return {
            data: {},
            ok: false
          };
        }
      }
    },
    async userMe({ commit, getters }) {
      try {
        const userMePromise = await axios.get(
          "/api/v1/user/me/",
          getters.headers
        );
        const {
          data: {
            id,
            email,
            first_name: firstName,
            last_name: lastName,
            groups
          }
        } = userMePromise;
        commit("me", { id, email, firstName, lastName, groups });
        return { data: { id, email, firstName, lastName, groups }, ok: true };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się pobrać danych użytkownika.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return { data, ok: false };
      }
    },
    async slotList({ commit, getters }) {
      try {
        const slotsPromise = await axios.get("/api/v1/slot/", getters.headers);
        const { data } = slotsPromise;
        return { data, ok: true };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się pobrać slotów.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return { data, ok: false };
      }
    },
    async availabilityPeriodList({ commit, getters }) {
      try {
        const availabilityPeriodPromise = await axios.get(
          "/api/v1/availability/period/",
          getters.headers
        );
        const { data } = availabilityPeriodPromise;
        return { data, ok: true };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się pobrać godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return { data, ok: false };
      }
    },
    async availabilityPeriodCreate({ commit, getters }, payload) {
      try {
        const availabilityPeriodPromise = await axios.post(
          "/api/v1/availability/period/",
          payload,
          getters.headers
        );
        const { data } = availabilityPeriodPromise;
        return { data, ok: true };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się zapisać godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return { data, ok: false };
      }
    },
    async availabilityPeriodUpdate(
      { commit, getters },
      { id, start, end, slot }
    ) {
      try {
        const availabilityPeriodPromise = await axios.put(
          `/api/v1/availability/period/${id}/`,
          { start, end, slot },
          getters.headers
        );
        const { data } = availabilityPeriodPromise;
        return { data, ok: true };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się uaktualnić godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return { data, ok: false };
      }
    },
    async availabilityPeriodDestroy({ commit, getters }, id) {
      try {
        await axios.delete(
          `/api/v1/availability/period/${id}/`,
          getters.headers
        );
      } catch ({ response: { status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się usunąć godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
      }
    },
    async login({ commit, dispatch }, { username, password }) {
      try {
        const tokenPromise = await axios.post("/api-token-auth/", {
          username,
          password
        });
        const { token } = tokenPromise?.data;
        commit("token", token);
        dispatch("userMe");
      } catch ({ response: { status } }) {
        if (status === 400) {
          commit("errorMessage", "Logowanie nie powiodło się.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
      }
    },
    logout({ commit }) {
      commit("token", undefined);
      commit("me", undefined);
    },
    wipeErrorMessage({ commit }) {
      commit("errorMessage", undefined);
    }
  },
  modules: {}
});
