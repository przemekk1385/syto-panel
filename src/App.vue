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
          <v-btn exact text :to="{ name: 'myCalendar' }">
            Mój kalendarz
          </v-btn>

          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-cogs</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item exact :to="{ name: 'overview' }">
                <v-list-item-title>Przegląd</v-list-item-title>
              </v-list-item>
              <v-list-item exact :to="{ name: 'slots' }">
                <v-list-item-title>Godziny</v-list-item-title>
              </v-list-item>
              <v-list-item exast :to="{ name: 'users' }">
                <v-list-item-title>Pracownicy</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

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
