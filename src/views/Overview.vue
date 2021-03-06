<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Tydzień {{ this.currentWeekNumber }}</h1>
        <p class="mt-3 text-body-1">
          <v-icon aria-label="Total" role="img">mdi-sigma</v-icon>
          <v-icon aria-label="Stationary hours" role="img">mdi-factory</v-icon>
          {{ totalStationaryHours }}
          <v-icon aria-label="Total" role="img">mdi-sigma</v-icon>
          <v-icon aria-label="Cottage hours" role="img"
            >mdi-home-city-outline</v-icon
          >
          {{ totalCottageHours }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet>
          <v-calendar
            color="primary"
            locale="pl"
            :now="today"
            show-week
            :value="today"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          >
            <template v-slot:day="{ date, past }">
              <v-container v-if="isCurrentWeekday(date)" class="mt-1" fluid>
                <v-row dense>
                  <v-col lg="6" md="12">
                    <v-badge
                      bottom
                      :color="!past ? 'primary' : 'secondary'"
                      :content="getStationaryHours(date) || '0'"
                      overlap
                    >
                      <v-icon large>mdi-factory</v-icon>
                    </v-badge>
                  </v-col>
                  <v-col lg="6" md="12">
                    <v-badge
                      bottom
                      :color="!past ? 'primary' : 'secondary'"
                      :content="getCottageHours(date) || '0'"
                      overlap
                    >
                      <v-icon large>mdi-home-city-outline</v-icon>
                    </v-badge>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="mt-3 text-body-2">
          <v-icon aria-label="Stationary hours" role="img" small
            >mdi-factory</v-icon
          >
          godziny stacjonarne<br />
          <v-icon aria-label="Stationary hours" role="img" small
            >mdi-home-city-outline</v-icon
          >
          godziny chałupnicze
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
var dayjs = require("dayjs");
var weekday = require("dayjs/plugin/weekday");
var weekOfYear = require("dayjs/plugin/weekOfYear");
var duration = require("dayjs/plugin/duration");

require("dayjs/locale/pl");

dayjs.locale("pl");
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(duration);

export default {
  name: "Calendar",
  data: () => ({
    today: "2021-03-03",
    hours: {
      "2021-03-08": {
        cottageHours: 20,
        stationaryHours: 80
      },
      "2021-03-07": {
        cottageHours: 30,
        stationaryHours: 30
      },
      "2021-03-06": {
        cottageHours: 50,
        stationaryHours: 150
      },
      "2021-03-05": {
        cottageHours: 20,
        stationaryHours: 80
      },
      "2021-03-04": {
        cottageHours: 30,
        stationaryHours: 30
      },
      "2021-03-03": {
        cottageHours: 50,
        stationaryHours: 150
      },
      "2021-03-02": {
        cottageHours: 20,
        stationaryHours: 20
      },
      "2021-03-01": {
        cottageHours: 40,
        stationaryHours: 160
      },
      "2021-02-28": {
        cottageHours: 30,
        stationaryHours: 30
      },
      "2021-02-27": {
        cottageHours: 30,
        stationaryHours: 30
      }
    }
  }),
  computed: {
    $_calendar_today() {
      return dayjs(this.today);
    },
    currentWeekdays() {
      return [0, 1, 2, 3, 4, 5, 6]
        .map(num => num - this.$_calendar_today.weekday())
        .map(relNum =>
          this.$_calendar_today
            .add(dayjs.duration({ days: relNum }))
            .format("YYYY-MM-DD")
        );
    },
    currentWeekNumber() {
      return this.$_calendar_today.week();
    },
    totalCottageHours() {
      return this.currentWeekdays
        .map(date => this.getCottageHours(date))
        .reduce((prev, current) => prev + current, 0);
    },
    totalStationaryHours() {
      return this.currentWeekdays
        .map(date => this.getStationaryHours(date))
        .reduce((prev, current) => prev + current, 0);
    }
  },
  mounted() {},
  methods: {
    getCottageHours(date) {
      return this.hours?.[date]?.cottageHours || 0;
    },
    getStationaryHours(date) {
      return this.hours?.[date]?.stationaryHours || 0;
    },
    isCurrentWeekday(day) {
      return this.currentWeekdays.indexOf(day) !== -1;
    }
  }
};
</script>
