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
          class="elevation-1"
          :expanded.sync="expanded"
          :headers="headers"
          :footer-props="footerProps"
          :items="items"
          item-key="day"
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
                    stationaryHours + cottageHours
                  }}</span>
                </v-avatar>
              </template>
              <span>Stacjonarne / Chałupnicze / Razem</span>
            </v-tooltip>
          </template>
          <template v-slot:expanded-item="{ headers, item: { workers } }">
            <td :colspan="headers.length">
              <v-chip
                v-for="(worker, i) in workers"
                :key="i"
                class="ma-1"
                :color="getColor(worker.groups)"
                dark
                small
              >
                <v-icon left small>
                  {{ getGroupIcon(worker.groups) }}
                </v-icon>
                {{ worker.firstName }} {{ worker.lastName }}
              </v-chip>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Overview",
  data: () => ({
    expanded: [],
    footerProps: {
      itemsPerPageOptions: [20, 50, 100]
    },

    headers: [
      {
        text: "Data",
        value: "day"
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
    items: []
  }),
  computed: {},
  async mounted() {
    const { data: items } = await this.availabilityOverviewList();

    console.log(items);

    this.items = items;
  },
  methods: {
    ...mapActions({
      availabilityOverviewList: "availabilityOverviewList"
    }),
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
