<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Godziny stacjonarne</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-dialog v-model="dialog" width="auto ">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" outlined large v-bind="attrs" v-on="on">
              <v-icon class="mr-3" left large>mdi-calendar-plus</v-icon>
              dodaj godziny
            </v-btn>
          </template>
          <v-form v-if="dialog" ref="availabilityForm">
            <v-card>
              <v-card-title class="headline">
                Godziny pracy
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      v-model="datePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Data"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="[rules.required]"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        first-day-of-week="1"
                        landscape
                        locale="pl"
                        :min="tomorrow"
                        :show-current="today"
                        @input="datePicker = false"
                      ></v-date-picker>
                    </v-menu>
                    <v-menu
                      v-model="startTimePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="start"
                          label="Godzina rozpoczęcia"
                          prepend-icon="mdi-clock-start"
                          readonly
                          :rules="[rules.required, rules.not23]"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="startTimePicker"
                        v-model="start"
                        :allowed-minutes="allowedStep"
                        format="24hr"
                        landscape
                        :max="hourBeforeEnd"
                        @input="startTimePicker = false"
                      ></v-time-picker>
                    </v-menu>
                    <v-menu
                      v-model="endTimePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="end"
                          label="Godzina zakończenia"
                          prepend-icon="mdi-clock-end"
                          readonly
                          :rules="[rules.required]"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="endTimePicker"
                        v-model="end"
                        :allowed-minutes="allowedStep"
                        format="24hr"
                        landscape
                        :min="hourAfterStart"
                        @input="endTimePicker = false"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" icon @click="submitAvailabilityForm()">
                  <v-icon class="mr-1">
                    mdi-send
                  </v-icon>
                </v-btn>
                <v-btn
                  color="error"
                  icon
                  @click="$refs.availabilityForm.reset()"
                >
                  <v-icon class="mr-1">
                    mdi-cancel
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
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
            @click:date="fillAvailabilityForm"
          >
            <template v-slot:day="{ date, past }">
              <v-container class="mt-1">
                <v-row dense>
                  <v-col class="text-center">
                    <v-sheet
                      v-if="events[date]"
                      :color="!past ? 'primary' : 'secondary'"
                      class="px-1 py-1 text-caption"
                      dark
                      rounded
                    >
                      {{ printEventDetails(date) }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-calendar>
        </v-sheet>
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

    date: undefined,
    start: undefined,
    end: undefined,

    dialog: false,
    rules: {
      required: value => !!value || "To pole jest wymagane!",
      not23: value => value?.split(":")?.[0] !== "23" || "Niedozwolona godzina!"
    },

    datePicker: false,
    startTimePicker: false,
    endTimePicker: false,

    events: {
      "2021-03-01": [
        {
          start: dayjs("2021-03-01 6:00"),
          end: dayjs("2021-03-01 14:00")
        }
      ],
      "2021-03-02": [
        {
          start: dayjs("2021-03-02 6:00"),
          end: dayjs("2021-03-02 14:00")
        }
      ],
      "2021-03-04": [
        {
          start: dayjs("2021-03-04 14:00"),
          end: dayjs("2021-03-04 22:00")
        }
      ],
      "2021-03-05": [
        {
          start: dayjs("2021-03-05 14:00"),
          end: dayjs("2021-03-05 22:00")
        }
      ],
      "2021-03-06": [
        {
          start: dayjs("2021-03-06 14:00"),
          end: dayjs("2021-03-06 22:00")
        }
      ],
      "2021-03-10": [
        {
          start: dayjs("2021-03-10 6:00"),
          end: dayjs("2021-03-10 12:00")
        }
      ]
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
    hourAfterStart() {
      if (this.start) {
        const hourAfter = dayjs(`${this.date || this.today} ${this.start}`).add(
          dayjs.duration({ hours: 1 })
        );
        return hourAfter.format("HH:mm");
      } else {
        return undefined;
      }
    },
    hourBeforeEnd() {
      if (this.end) {
        const hourBefore = dayjs(
          `${this.date || this.today} ${this.end}`
        ).subtract(dayjs.duration({ hours: 1 }));
        return hourBefore.format("HH:mm");
      } else {
        return undefined;
      }
    },
    tomorrow() {
      return this.$_calendar_today
        .add(dayjs.duration({ days: 1 }))
        .format("YYYY-MM-DD");
    }
  },
  mounted() {},
  methods: {
    allowedStep: m => m % 5 === 0,
    isCurrentWeekday(day) {
      return this.currentWeekdays.indexOf(day) !== -1;
    },
    printEventDetails(date) {
      const { start, end } = this.events?.[date]?.[0] || {};

      return `${start.format("HH:mm")}-${end.format("HH:mm")} ${end.diff(
        start,
        "hour"
      )} godz.`;
    },
    fillAvailabilityForm({ date, future }) {
      if (future) {
        this.date = date;
        this.start = this.events?.[date]?.[0]?.start?.format("HH:mm");
        this.end = this.events?.[date]?.[0]?.end?.format("HH:mm");
        this.dialog = true;
      }
    },
    submitAvailabilityForm() {
      if (this.$refs.availabilityForm.validate()) {
        this.events[this.date] = [
          {
            start: dayjs(`${this.date} ${this.start}`),
            end: dayjs(`${this.date} ${this.end}`)
          }
        ];
        this.dialog = false;
      }
    }
  }
};
</script>
