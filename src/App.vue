<template>
  <div id="app">
    <v-app>
      <v-app-bar app dense>
        <v-app-bar-title
          >SYTO<span class="blue--text text--darken-2"
            >Panel</span
          ></v-app-bar-title
        >

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn exact text :to="{ name: 'MyCalendar' }">
            Mój kalendarz
          </v-btn>

          <v-menu v-if="isForeman">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-cogs</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item exact :to="{ name: 'Timetable' }">
                <v-list-item-title>Grafik</v-list-item-title>
              </v-list-item>
              <v-list-item exact :to="{ name: 'Overview' }">
                <v-list-item-title>Przegląd</v-list-item-title>
              </v-list-item>
              <v-list-item exact :to="{ name: 'Slots' }">
                <v-list-item-title>Dni robocze</v-list-item-title>
              </v-list-item>
              <v-list-item exast :to="{ name: 'Users' }">
                <v-list-item-title>Pracownicy</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn icon @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>

      <v-main>
        <router-view />
        <v-snackbar v-model="displaySnackbar">
          {{ errorMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="wipeErrorMessage">
              Zamknij
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>

      <v-footer app> </v-footer>
    </v-app>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      isForeman: "isForeman"
    }),
    errorMessage() {
      return this.$store.state.errorMessage;
    },
    displaySnackbar: {
      get() {
        return Boolean(this.errorMessage);
      },
      set() {
        this.wipeErrorMessage();
      }
    }
  },
  watch: {
    isAuthenticated(val) {
      if (!val) {
        this.$router.push({ name: "Login" });
      }
    }
  },
  methods: {
    ...mapActions({ logout: "logout", wipeErrorMessage: "wipeErrorMessage" })
  }
};
</script>
