<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Mój kalendarz</h1>
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
                          v-model="slot"
                          label="Data"
                          prepend-icon="mdi-calendar"
                          readonly
                          :rules="[rules.required]"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="slot"
                        first-day-of-week="1"
                        landscape
                        locale="pl"
                        :min="tomorrow"
                        :show-current="today"
                        @change="fillAvailabilityForm(slot)"
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
                <v-btn
                  color="primary"
                  icon
                  outlined
                  @click="submitAvailabilityForm"
                >
                  <v-icon class="mr-1">
                    mdi-send
                  </v-icon>
                </v-btn>
                <v-btn
                  color="warning"
                  icon
                  outlined
                  @click="$refs.availabilityForm.reset()"
                >
                  <v-icon class="mr-1">
                    mdi-eraser
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
            show-week
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            @click:date="fillAvailabilityForm"
          >
            <template v-slot:day-label="{ date, past, present }">
              <v-btn
                :color="present ? 'primary' : ''"
                :disabled="past || openDays.indexOf(date) === -1"
                elevation="0"
                fab
                small
                :text="!present"
                @click="fillAvailabilityForm(date)"
              >
                {{ formatDate(date) }}
              </v-btn>
            </template>
            <template v-slot:day="{ date, past }">
              <v-container class="mt-1">
                <v-row dense>
                  <v-col class="text-center">
                    <v-sheet
                      v-if="availabilityPeriods[date]"
                      :color="!past ? 'primary' : 'secondary'"
                      class="px-1 py-1 text-caption"
                      dark
                      rounded
                    >
                      {{ getSummary(date) }}
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
require("dayjs/locale/pl");

import { mapActions } from "vuex";

var dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");

dayjs.locale("pl");
dayjs.extend(duration);

export default {
  name: "MyCalendar",
  data() {
    return {
      availabilityPeriods: {},
      openDays: [],

      dialog: false,

      datePicker: false,
      startTimePicker: false,
      endTimePicker: false,

      rules: {
        required: value => !!value || "To pole jest wymagane.",
        not23: value =>
          value?.split(":")?.[0] !== "23" || "Niedozwolona godzina."
      },

      id: undefined,
      start: undefined,
      end: undefined,
      slot: undefined
    };
  },
  computed: {
    hourAfterStart() {
      if (this.start) {
        const hourAfter = dayjs(`${this.slot || this.today} ${this.start}`).add(
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
          `${this.slot || this.today} ${this.end}`
        ).subtract(dayjs.duration({ hours: 1 }));
        return hourBefore.format("HH:mm");
      } else {
        return undefined;
      }
    },
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
    tomorrow() {
      return dayjs()
        .add(dayjs.duration({ days: 1 }))
        .format("YYYY-MM-DD");
    }
  },
  async mounted() {
    const { data: openDays = [] } = await this.slotList();
    const {
      data: availabilityPeriods = []
    } = await this.availabilityPeriodList();

    this.openDays = openDays.map(item => item.day);
    this.availabilityPeriods = availabilityPeriods.reduce(
      (prev, { id, start, end, slot }) =>
        Object.assign(prev, { [slot]: { id, start, end } }),
      {}
    );
  },
  methods: {
    ...mapActions({
      slotList: "slotList",
      availabilityPeriodList: "availabilityPeriodList",
      availabilityPeriodCreate: "availabilityPeriodCreate",
      availabilityPeriodUpdate: "availabilityPeriodUpdate"
    }),
    allowedStep: m => m % 5 === 0,

    formatDate: date => {
      const day = dayjs(date);
      if (day.date() === 1) {
        return day.format("D MMM");
      } else {
        return day.format("D");
      }
    },
    getSummary(date) {
      let { start, end } = this.availabilityPeriods?.[date] || {};
      start = dayjs(`${date} ${start}`);
      end = dayjs(`${date} ${end}`);

      return `${start.format("HH:mm")}-${end.format("HH:mm")} ${end.diff(
        start,
        "hour"
      )} godz.`;
    },

    fillAvailabilityForm(date) {
      const { start, end } = this.availabilityPeriods?.[date] || {};

      this.start = start;
      this.end = end;
      this.slot = date;
      this.dialog = true;
    },
    async submitAvailabilityForm() {
      if (this.$refs.availabilityForm.validate()) {
        const payload = {
          start: this.start,
          end: this.end,
          slot: this.slot
        };
        let r;

        if (!this.id) {
          r = await this.availabilityPeriodCreate(payload);
        } else {
          r = await this.availabilityPeriodUpdate(
            Object.assign(payload, { id: this.id })
          );
        }

        const { data: { id, start, end, slot } = {}, ok } = r;

        if (ok) {
          this.availabilityPeriods[slot] = { id, start, end };
        }

        this.dialog = false;
      }
    }
  }
};
</script>
