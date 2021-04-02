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
        const userCreatePromise = await axios.post("api/v1/user/", {
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
        const { data: { id } = {} } = userCreatePromise;
        return { id };
      } catch ({
        response: { data: { email, phone_number: phoneNumber } = {}, status }
      }) {
        if (status === 400) {
          commit("errorMessage", "Rejestracja nie powiodła się.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
          return {
          formErrors: {
              email: email || [],
              phoneNumber: phoneNumber || []
            },
          id: undefined
          };
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
            is_active: isActive,
            groups,
            date_of_birth: dateOfBirth,
            phone_number: phoneNumber,
            address
          } = {}
        } = userMePromise;
        return {
          id,
          email,
          firstName,
          lastName,
          isActive,
          groups,
          dateOfBirth,
          phoneNumber,
          address
        };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się pobrać danych użytkownika.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return {};
      }
    },
    async slotList({ commit, getters }, extra = "") {
      try {
        const slotsPromise = await axios.get(
          `/api/v1/slot/${extra}`,
          getters.headers
        );
        const { data = [] } = slotsPromise;
        return {
          data: data.map(
            ({
              id,
              day,
              stationary_workers_limit: stationaryWorkersLimit,
              is_open_for_cottage_workers: isOpenForCottageWorkers
            }) => ({ id, day, stationaryWorkersLimit, isOpenForCottageWorkers })
          ),
          ok: true
        };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się pobrać slotów.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return { data, ok: false };
      }
    },
    async slotCreate(
      { commit, getters },
      {
        day,
        stationaryWorkersLimit: stationary_workers_limit,
        isOpenForCottageWorkers: is_open_for_cottage_workers
      }
    ) {
      try {
        await axios.post(
          "/api/v1/slot/",
          { day, stationary_workers_limit, is_open_for_cottage_workers },
          getters.headers
        );
        return day;
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się zdefiniować dnia roboczego.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return undefined;
      }
    },
    async slotUpdate(
      { commit, getters },
      {
        day,
        stationaryWorkersLimit: stationary_workers_limit,
        isOpenForCottageWorkers: is_open_for_cottage_workers
      }
    ) {
      try {
        await axios.put(
          `/api/v1/slot/${day}/`,
          { stationary_workers_limit, is_open_for_cottage_workers },
          getters.headers
        );
        return day;
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się uaktualnić dnia roboczego.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return undefined;
      }
    },
    async slotDestroy({ commit, getters }, day) {
      try {
        await axios.delete(`/api/v1/slot/${day}/`, getters.headers);
        return day;
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się usunąć dnia roboczego.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return undefined;
      }
    },
    async availabilityOverviewList({ commit, getters }) {
      try {
        const availabilityOverviewPromise = await axios.get(
          "/api/v1/availability/",
          getters.headers
        );
        const { data = [] } = availabilityOverviewPromise;
        return {
          data: data.map(
            ({
              day,
              cottage_hours: cottageHours,
              cottage_workers: cottageWorkers,
              stationary_hours: stationaryHours,
              stationary_workers: stationaryWorkers,
              workers
            }) => ({
              day,
              cottageHours,
              cottageWorkers,
              stationaryHours,
              stationaryWorkers,
              workers: workers.map(
                ({ first_name: firstName, last_name: lastName, groups }) => ({
                  firstName,
                  lastName,
                  groups
                })
              )
            })
          ),
          ok: true
        };
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się pobrać zestawień.");
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
        const { data = {} } = availabilityPeriodPromise;
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
        const {
          data: { id }
        } = await axios.post(
          "/api/v1/availability/period/",
          payload,
          getters.headers
        );
        return id;
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się zapisać godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return undefined;
      }
    },
    async availabilityPeriodUpdate(
      { commit, getters },
      { id, start, end, slot }
    ) {
      try {
        await axios.put(
          `/api/v1/availability/period/${id}/`,
          { start, end, slot },
          getters.headers
        );
        return id;
      } catch ({ response: { data, status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się uaktualnić godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return undefined;
      }
    },
    async availabilityPeriodDestroy({ commit, getters }, id) {
      try {
        await axios.delete(
          `/api/v1/availability/period/${id}/`,
          getters.headers
        );
        return id;
      } catch ({ response: { status } }) {
        if (status === 400) {
          commit("errorMessage", "Nie udało się usunąć godzin.");
        } else {
          commit("errorMessage", `Nieznany błąd. Kod ${status}.`);
        }
        return undefined;
      }
    },
    async login({ commit, dispatch }, { username, password }) {
      try {
        const tokenPromise = await axios.post("/api-token-auth/", {
          username,
          password
        });
        const { data: { token } = {} } = tokenPromise;
        commit("token", token);
        const me = dispatch("userMe");
        commit("me", me);
      } catch ({ response: { data, status } }) {
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
