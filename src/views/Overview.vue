<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Przegląd</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          locale="pl-PL"
          class="elevation-1"
          :expanded.sync="expanded"
          :headers="headers"
          :footer-props="footerProps"
          :items="items"
          item-key="date"
          pagination.sync="pagination"
          show-expand
        >
          <template
            v-slot:[`item.totalWorkers`]="{
              item: { stationaryWorkers, cottageWorkers }
            }"
          >
            {{ stationaryWorkers }} / {{ cottageWorkers }} /
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar color="primary" size="32" v-bind="attrs" v-on="on">
                  <span class="white--text">{{
                    stationaryWorkers + cottageWorkers
                  }}</span>
                </v-avatar>
              </template>
              <span>Stacjonarni / Chałupnicy / Razem</span>
            </v-tooltip>
          </template>
          <template
            v-slot:[`item.totalHours`]="{
              item: { stationaryHours, cottageHours }
            }"
          >
            {{ stationaryHours }} / {{ cottageHours }} /
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar color="primary" size="32" v-bind="attrs" v-on="on">
                  <span class="white--text">{{
                    stationaryHours + cottageHours + 100
                  }}</span>
                </v-avatar>
              </template>
              <span>Stacjonarne / Chałupnicze / Razem</span>
            </v-tooltip>
          </template>
          <template v-slot:expanded-item="{ headers, item: { users } }">
            <td :colspan="headers.length">
              <v-chip
                v-for="(user, i) in users"
                :key="i"
                class="ma-1"
                :color="getColor(user.groups)"
                dark
                small
              >
                <v-icon left small>
                  {{ getGroupIcon(user.groups) }}
                </v-icon>
                {{ user.email }}
              </v-chip>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Overview",
  data: () => ({
    expanded: [],
    footerProps: {
      itemsPerPageOptions: [20, 50, 100]
    },

    today: "2021-03-03",
    headers: [
      {
        text: "Data",
        value: "date"
      },
      {
        text: "Pracownicy",
        value: "totalWorkers",
        sortable: false
      },
      {
        text: "Godziny",
        value: "totalHours",
        sortable: false
      },
      { text: "", value: "data-table-expand" }
    ],
    items: [
      {
        date: "2021-03-08",
        stationaryHours: 8,
        stationaryWorkers: 1,
        cottageHours: 10,
        cottageWorkers: 2,
        users: [
          {
            email: "foo1@bar.baz",
            groups: ["cottage_worker", "new_employee"]
          },
          {
            email: "foo2@bar.baz",
            groups: ["cottage_worker"]
          },
          {
            email: "foo3@bar.baz",
            groups: ["stationary_worker", "new_employee"]
          }
        ]
      },
      {
        date: "2021-03-09",
        stationaryHours: 8,
        stationaryWorkers: 1,
        cottageHours: 10,
        cottageWorkers: 2,
        users: [
          {
            email: "foo1@bar.baz",
            groups: ["cottage_worker", "new_employee"]
          },
          {
            email: "foo2@bar.baz",
            groups: ["cottage_worker"]
          },
          {
            email: "foo3@bar.baz",
            groups: ["stationary_worker", "new_employee"]
          }
        ]
      },
      {
        date: "2021-03-10",
        stationaryHours: 8,
        stationaryWorkers: 1,
        cottageHours: 10,
        cottageWorkers: 2,
        users: [
          {
            email: "foo1@bar.baz",
            groups: ["cottage_worker", "new_employee"]
          },
          {
            email: "foo2@bar.baz",
            groups: ["cottage_worker"]
          },
          {
            email: "foo3@bar.baz",
            groups: ["stationary_worker", "new_employee"]
          }
        ]
      }
    ]
  }),
  computed: {},
  mounted() {},
  methods: {
    getColor(groups) {
      if (groups.indexOf("new_employee") !== -1) {
        return "green";
      } else {
        return "primary";
      }
    },
    getGroupIcon(groups) {
      if (
        groups.indexOf("stationary_worker") !== -1 &&
        groups.indexOf("cottage_worker") === -1
      ) {
        return "mdi-factory";
      } else if (
        groups.indexOf("stationary_worker") === -1 &&
        groups.indexOf("cottage_worker") !== -1
      ) {
        return "mdi-home-city-outline";
      } else {
        return "mdi-alert-circle-outline";
      }
    }
  }
};
</script>
