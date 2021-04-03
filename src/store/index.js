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
    async userList({ commit, getters }) {
      try {
        const userListPromise = await axios.get(
          "/api/v1/user/",
          getters.headers
        );
        const { data = [] } = userListPromise;
        return data.map(
          ({
            id,
            email,
            first_name: firstName,
            last_name: lastName,
            is_active: isActive,
            groups,
            date_of_birth: dateOfBirth,
            phone_number: phoneNumber,
            address
          }) => ({
            id,
            email,
            firstName,
            lastName,
            isActive,
            groups,
            dateOfBirth,
            phoneNumber,
            address
          })
        );
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Nie udało się pobrać użytkowników. Kod błędu ${status}.`
        );
        return [];
      }
    },
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
        commit(
          "errorMessage",
          `Rejestracja nie powiodła się. Kod błędu ${status}.`
        );
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
        commit(
          "errorMessage",
          `Nie udało się pobrać danych użytkownika. Kod błędu ${status}.`
        );
        return { id: undefined };
      }
    },
    async userToggleIsActive({ commit, getters, state }, id) {
      try {
        const userTogglePromise = await axios.get(
          `/api/v1/user/${id}/toggle_is_active/`,
          getters.headers
        );
        const { data: { is_active: isActive } = {} } = userTogglePromise;
        return { id, isActive };
      } catch ({ response: { data, status } }) {
        const { me: { isActive } = {} } = state;
        if (isActive) {
          commit(
            "errorMessage",
            `Nie udało się dezaktywować użytkownika. Kod błędu ${status}.`
          );
        } else {
          commit(
            "errorMessage",
            `Nie udało się aktywować użytkownika. Kod błędu ${status}.`
          );
        }
        return { id: undefined };
      }
    },
    async slotList({ commit, getters }, extra = "") {
      try {
        const slotsPromise = await axios.get(
          `/api/v1/slot/${extra}`,
          getters.headers
        );
        const { data = [] } = slotsPromise;
        return data.map(
          ({
            id,
            day,
            stationary_workers_limit: stationaryWorkersLimit,
            is_open_for_cottage_workers: isOpenForCottageWorkers
          }) => ({ id, day, stationaryWorkersLimit, isOpenForCottageWorkers })
        );
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Nie udało się pobrać slotów. Kod błędu ${status}.`
        );
        return [];
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
        commit(
          "errorMessage",
          `Nie udało się zdefiniować dnia roboczego. Kod błędu ${status}.`
        );
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
        commit(
          "errorMessage",
          `Nie udało się uaktualnić dnia roboczego. Kod błędu ${status}.`
        );
        return undefined;
      }
    },
    async slotDestroy({ commit, getters }, day) {
      try {
        await axios.delete(`/api/v1/slot/${day}/`, getters.headers);
        return day;
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Nie udało się usunąć dnia roboczego. Kod błędu ${status}.`
        );
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
        return data.map(
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
        );
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Nie udało się pobrać zestawień. Kod błędu ${status}.`
        );
        return [];
      }
    },
    async availabilityPeriodList({ commit, getters }) {
      try {
        const availabilityPeriodPromise = await axios.get(
          "/api/v1/availability/period/",
          getters.headers
        );
        const { data = [] } = availabilityPeriodPromise;
        return data;
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Nie udało się pobrać godzin. Kod błędu ${status}.`
        );
        return [];
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
        commit(
          "errorMessage",
          `Nie udało się zapisać godzin. Kod błędu ${status}.`
        );
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
        commit(
          "errorMessage",
          `Nie udało się uaktualnić godzin. Kod błędu ${status}.`
        );
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
        commit(
          "errorMessage",
          `Nie udało się usunąć godzin. Kod błędu ${status}.`
        );
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
        commit(
          "errorMessage",
          `Logowanie nie powiodło się. Kod błędu ${status}.`
        );
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
