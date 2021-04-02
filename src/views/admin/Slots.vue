<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Dni robocze</h1>
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
            <v-form v-if="dialog" ref="slotForm">
              <v-card>
                <v-card-title class="headline">
                  Dzień roboczy
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
                            v-model="day"
                            label="Data"
                            prepend-icon="mdi-calendar"
                            readonly
                            :rules="[rules.required]"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="day"
                          first-day-of-week="1"
                          landscape
                          locale="pl"
                          :min="tomorrow"
                          :show-current="today"
                          @change="fillSlotForm(day)"
                          @input="datePicker = false"
                        ></v-date-picker>
                      </v-menu>
                      <v-text-field
                        v-model="stationaryWorkersLimit"
                        label="Limit pracowników stacjonarnych"
                        prepend-icon="mdi-account-hard-hat"
                        :rules="[rules.positiveInt, ...extraRules]"
                        @blur="fixStationaryWorkersLimit"
                      ></v-text-field>
                      <v-switch
                        v-model="isOpenForCottageWorkers"
                        label="Otwarty dla chałupników"
                        :rules="extraRules"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" icon outlined @click="submitSlotForm">
                    <v-icon class="mx-2">
                      mdi-send
                    </v-icon>
                  </v-btn>
                  <v-btn color="warning" icon outlined @click="resetSlotForm">
                    <v-icon class="mx-2">
                      mdi-eraser
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="slots[day]"
                    color="error"
                    icon
                    outlined
                    @click="deleteSlot"
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
                :disabled="past"
                elevation="0"
                fab
                small
                :text="!present"
                @click="fillSlotForm(date)"
              >
                {{ formatDate(date) }}
              </v-btn>
            </template>
            <template v-slot:day="{ date, past }">
              <v-container v-if="slots[date]" class="mt-1">
                <v-toolbar color="transparent" dense flat tag="div">
                  <v-badge
                    v-if="slots[date].stationaryWorkersLimit"
                    bottom
                    :color="!past ? 'primary' : 'secondary'"
                    :content="getStationaryWorkersLimit(date)"
                    overlap
                  >
                    <v-icon :disabled="past">mdi-account-hard-hat</v-icon>
                  </v-badge>
                  <v-spacer></v-spacer>
                  <v-icon
                    v-if="slots[date].isOpenForCottageWorkers"
                    :color="!past ? 'primary' : 'secondary'"
                    :disabled="past"
                    >mdi-home-city-outline</v-icon
                  ></v-toolbar
                >
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
  name: "Slots",
  data: () => ({
    slots: {},

    dialog: false,

    datePicker: false,

    rules: {
      positiveInt: value =>
        !value ||
        Number.parseInt(value) > 0 ||
        "Wymagana liczba całkowita większa od 0.",
      required: value => !!value || "To pole jest wymagane.",
      oneRequired: value => !!value || "Jedno z pól jest wymagane."
    },
    extraRules: [],

    day: undefined,
    stationaryWorkersLimit: undefined,
    isOpenForCottageWorkers: undefined,

    value: ""
  }),
  computed: {
    oneRequired() {
      return !this.stationaryWorkersLimit && !this.isOpenForCottageWorkers;
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
  watch: {
    dialog(val) {
      if (!val) {
        this.datePicker = false;
        this.resetSlotForm();
      }
    },
    oneRequired(val) {
      if (val) {
        this.extraRules = [this.rules.oneRequired];
      } else {
        this.extraRules = [];
      }
    }
  },
  async mounted() {
    const slots = await this.slotList("all/");

    this.slots = slots.reduce(
      (prev, { id, day, stationaryWorkersLimit, isOpenForCottageWorkers }) =>
        Object.assign(prev, {
          [day]: { id, stationaryWorkersLimit, isOpenForCottageWorkers }
        }),
      {}
    );
  },
  methods: {
    ...mapActions({
      slotList: "slotList",
      slotCreate: "slotCreate",
      slotUpdate: "slotUpdate",
      slotDestroy: "slotDestroy"
    }),
    fixStationaryWorkersLimit() {
      const { stationaryWorkersLimit } = this;

      this.stationaryWorkersLimit =
        Number.parseInt(stationaryWorkersLimit, 10) || stationaryWorkersLimit;
    },

    formatDate: date => {
      const day = dayjs(date);
      if (day.date() === 1) {
        return day.format("D MMM");
      } else {
        return day.format("D");
      }
    },

    getStationaryWorkersLimit(date) {
      return this.slots?.[date]?.stationaryWorkersLimit || "0";
    },

    fillSlotForm(date) {
      const { stationaryWorkersLimit, isOpenForCottageWorkers } =
        this.slots?.[date] || {};

      this.day = date;
      this.stationaryWorkersLimit = stationaryWorkersLimit;
      this.isOpenForCottageWorkers = isOpenForCottageWorkers;

      this.dialog = true;
    },
    resetSlotForm() {
      this.$refs.slotForm.reset();
      this.day = undefined;
    },
    async submitSlotForm() {
      if (this.$refs.slotForm.validate()) {
        const { stationaryWorkersLimit, isOpenForCottageWorkers } = this;
        let { day } = this;

        if (!this.slots[day]) {
          day = await this.slotCreate({
            day,
            stationaryWorkersLimit,
            isOpenForCottageWorkers
          });
        } else {
          day = await this.slotUpdate({
            day,
            stationaryWorkersLimit,
            isOpenForCottageWorkers
          });
        }

        if (day)
          this.slots[day] = { stationaryWorkersLimit, isOpenForCottageWorkers };

        this.dialog = false;
      }
    },
    async deleteSlot() {
      const { day } = this;

      if (this.slots[day] && (await this.slotDestroy(day))) {
        delete this.slots[day];
      }

      this.dialog = false;
    }
  }
};
</script>
