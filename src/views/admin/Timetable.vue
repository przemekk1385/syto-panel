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
          :height="height"
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

// import colors from "vuetify/lib/util/colors";

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
      plotOptions: {
        bar: {
          horizontal: true,
          // distributed: true,
          dataLabels: {
            hideOverflowingLabels: true
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val /*, opts*/) {
          // var label = opts.w.globals.labels[opts.dataPointIndex];
          var a = dayjs(val[0]);
          var b = dayjs(val[1]);
          var diff = b.diff(a, "hours");
          // return `${label}: ${diff} godz.`;
          return `${diff} godz.`;
        },
        style: {
          colors: ["#f3f4f5", "#fff"]
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
      },
      // yaxis: {
      //   show: false
      // },
      grid: {
        row: {
          colors: ["#f3f4f5", "#fff"],
          opacity: 1
        }
      }
    }
  }),
  computed: {
    height() {
      return 65 + this.workersCount * 48;
    },
    workersCount() {
      return [...new Set(this.series[0].data.map(({ x }) => x))].length;
    }
  },
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
