<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Grafik</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <apexchart
          height="100%"
          :options="chartOptions"
          :series="series"
          type="rangeBar"
        >
        </apexchart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import colors from "vuetify/lib/util/colors";

import VueApexCharts from "vue-apexcharts";
var pl = require("apexcharts/dist/locales/pl.json");

var dayjs = require("dayjs");
require("dayjs/locale/pl");
dayjs.locale("pl");

export default {
  components: {
    apexchart: VueApexCharts
  },
  data: () => ({
    series: [{ data: [] }],
    chartOptions: {
      chart: {
        defaultLocale: "pl",
        locales: [pl],
        type: "rangeBar"
      },
      colors: [colors.blue.darken2],
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            hideOverflowingLabels: true
          }
        }
      },
      tooltip: {
        x: {
          format: "d MMM, H:mm"
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false
        }
      }
    }
  }),
  computed: {},
  async mounted() {
    const data = await this.availabilityPeriodAll();

    this.series[0].data = data.map(
      ({ start, end, slot, worker: { firstName, lastName } }) => {
        const a = dayjs(`${slot} ${start}`);
        let b = dayjs(`${slot} ${end}`);

        if (a > b) {
          b = b.add(dayjs.duration({ days: 1 }));
        }

        return {
          x: `${firstName} ${lastName}`,
          y: [a.valueOf(), b.valueOf()]
        };
      }
    );
  },
  methods: {
    ...mapActions({ availabilityPeriodAll: "availabilityPeriodAll" })
  }
};
</script>
