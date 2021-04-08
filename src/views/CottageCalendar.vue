<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Mój kalendarz</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-toolbar flat tag="div">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" width="auto ">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                dark
                fab
                class="mx-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark>mdi-calendar-plus</v-icon>
              </v-btn>
            </template>
            <v-form v-if="dialog" ref="availabilityForm">
              <v-card width="400">
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
                      <v-text-field
                        v-model="hours"
                        label="Czas pracy"
                        prepend-icon="mdi-clock"
                        :rules="[rules.required, rules.max]"
                        type="text"
                      ></v-text-field>
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
                    <v-icon class="mx-2">
                      mdi-send
                    </v-icon>
                  </v-btn>
                  <v-btn
                    color="warning"
                    icon
                    outlined
                    @click="resetAvailabilityForm"
                  >
                    <v-icon class="mx-2">
                      mdi-eraser
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="id"
                    color="error"
                    icon
                    outlined
                    @click="deleteAvailabilityHours"
                  >
                    <v-icon class="mx-2">
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
          <v-btn
            color="primary"
            dark
            fab
            class="mx-2"
            @click="$refs.calendar.prev()"
          >
            <v-icon dark>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            dark
            fab
            class="mx-2"
            @click="$refs.calendar.next()"
          >
            <v-icon dark>mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="value"
            color="primary"
            locale="pl"
            show-week
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
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
                      v-if="availabilityHours[date]"
                      :color="!past ? 'primary' : 'secondary'"
                      class="px-1 py-1 text-caption"
                      dark
                      rounded
                    >
                      {{ printSummary(date) }}
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
import { mapActions } from "vuex";

var dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");

require("dayjs/locale/pl");
dayjs.extend(duration);
dayjs.locale("pl");

export default {
  name: "CottageCalendar",
  data() {
    return {
      availabilityHours: {},
      openDays: [],

      dialog: false,

      datePicker: false,

      rules: {
        required: value => !!value || "To pole jest wymagane.",
        max: value => value <= 16 || "Maksymalna dozwolona liczba godzin to 16."
      },

      id: undefined,
      hours: undefined,
      slot: undefined,

      value: ""
    };
  },
  computed: {
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
    tomorrow() {
      return dayjs()
        .add(dayjs.duration({ days: 1 }))
        .format("YYYY-MM-DD");
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.datePicker = false;

        this.resetAvailabilityForm();
      }
    }
  },
  async mounted() {
    const openDays = await this.slotList();
    const availabilityHours = await this.availabilityHoursList();

    this.openDays = openDays.map(item => item.day);
    this.availabilityHours = availabilityHours.reduce(
      (prev, { id, hours, slot }) =>
        Object.assign(prev, { [slot]: { id, hours } }),
      {}
    );
  },
  methods: {
    formatDate: date => {
      const day = dayjs(date);
      if (day.date() === 1) {
        return day.format("D MMM");
      } else {
        return day.format("D");
      }
    },
    printSummary(date) {
      const { hours } = this.availabilityHours?.[date] || {};

      return `${hours} godz.`;
    },

    ...mapActions({
      slotList: "slotList",
      availabilityHoursList: "availabilityHoursList",
      availabilityHoursCreate: "availabilityHoursCreate",
      availabilityHoursUpdate: "availabilityHoursUpdate",
      availabilityHoursDestroy: "availabilityHoursDestroy"
    }),

    async submitAvailabilityForm() {
      if (this.$refs.availabilityForm.validate()) {
        const { hours, slot } = this;
        let { id } = this;

        if (!id) {
          id = await this.availabilityHoursCreate({
            hours,
            slot
          });
        } else {
          id = await this.availabilityHoursUpdate({
            id: this.id,
            hours,
            slot
          });
        }

        if (id) this.availabilityHours[this.slot] = { id, hours, slot };

        this.dialog = false;
      }
    },
    async deleteAvailabilityHours() {
      const { id, slot } = this;

      if (id && (await this.availabilityHoursDestroy(id))) {
        delete this.availabilityHours[slot];
      }

      this.dialog = false;
    },

    fillAvailabilityForm(date) {
      const { id, hours } = this.availabilityHours?.[date] || {};

      this.id = id;
      this.hours = hours;
      this.slot = date;

      this.dialog = true;
    },
    resetAvailabilityForm() {
      this.$refs.availabilityForm.reset();
      this.id = undefined;
    }
  }
};
</script>
