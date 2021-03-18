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
          <v-btn exact text :to="{ name: 'overview' }">
            Przegląd
          </v-btn>

          <v-btn exact text :to="{ name: 'slots' }">
            Kalendarz
          </v-btn>

          <v-btn exact text :to="{ name: 'hours' }">
            Godziny
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>

      <v-main>
        <router-view />
      </v-main>

      <v-footer app> </v-footer>
    </v-app>
  </div>
</template>
