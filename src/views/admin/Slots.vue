<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Godziny</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet>
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <v-btn icon class="mr-2" @click="$refs.calendar.prev()">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon class="ml-2" @click="$refs.calendar.next()">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-toolbar>
        </v-sheet>
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="value"
            color="primary"
            locale="pl"
            :now="today"
            show-week
            :value="today"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            @click:date="fillSlotForm"
          >
            <template v-slot:day="{ date, past }">
              <v-container v-if="slots[date]" class="mt-1">
                <v-toolbar dense flat>
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
    <v-row>
      <v-col class="text-right">
        <v-dialog v-model="dialog" width="auto ">
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
                        :min="$_calendar_tomorrow"
                        :show-current="today"
                        @input="datePicker = false"
                      ></v-date-picker>
                    </v-menu>
                    <v-text-field
                      v-model="stationaryWorkersLimit"
                      label="Limit pracowników stacjonarnych"
                      prepend-icon="mdi-account-hard-hat"
                      :rules="[rules.positiveInt]"
                      @blur="fixStationaryWorkersLimit"
                    ></v-text-field>
                    <v-switch
                      v-model="isOpenForCottageWorkers"
                      label="Otwarty dla chałupników"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  aria-label="Send form"
                  color="primary"
                  icon
                  @click="submitSlotForm()"
                >
                  <v-icon class="mr-1">
                    mdi-send
                  </v-icon>
                </v-btn>
                <v-btn
                  aria-label="Reset form"
                  color="error"
                  icon
                  @click="$refs.slotForm.reset()"
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
  </v-container>
</template>

<script>
var dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");

require("dayjs/locale/pl");

dayjs.locale("pl");
dayjs.extend(duration);

export default {
  name: "Calendar",
  data: () => ({
    // form stuff
    dialog: false,
    datePicker: false,

    rules: {
      positiveInt: value =>
        !value ||
        Number.parseInt(value) > 0 ||
        "Wymagana liczba całkowita, większa od 0!",
      required: value => !!value || "To pole jest wymagane!"
    },

    // form data
    date: undefined,
    stationaryWorkersLimit: undefined,
    isOpenForCottageWorkers: undefined,

    // calendar stuff
    value: "",

    today: "2021-03-03",
    slots: {
      "2021-03-01": {
        stationaryWorkersLimit: 20,
        isOpenForCottageWorkers: true
      },
      "2021-03-02": {
        stationaryWorkersLimit: 20,
        isOpenForCottageWorkers: false
      },
      "2021-03-03": {
        stationaryWorkersLimit: 10,
        isOpenForCottageWorkers: false
      },
      "2021-03-04": {
        stationaryWorkersLimit: 0,
        isOpenForCottageWorkers: true
      },
      "2021-03-05": {
        stationaryWorkersLimit: 20,
        isOpenForCottageWorkers: true
      },
      "2021-03-06": {
        stationaryWorkersLimit: 20,
        isOpenForCottageWorkers: true
      }
    }
  }),
  computed: {
    $_calendar_today() {
      return dayjs(this.today);
    },
    $_calendar_tomorrow() {
      return this.$_calendar_today
        .add(dayjs.duration({ days: 1 }))
        .format("YYYY-MM-DD");
    }
  },
  mounted() {},
  methods: {
    getStationaryWorkersLimit(date) {
      return this.slots?.[date]?.stationaryWorkersLimit || "0";
    },
    fixStationaryWorkersLimit() {
      const { stationaryWorkersLimit } = this;

      this.stationaryWorkersLimit =
        Number.parseInt(stationaryWorkersLimit, 10) || stationaryWorkersLimit;
    },
    fillSlotForm({ date, future }) {
      if (future) {
        this.date = date;
        this.stationaryWorkersLimit = this.slots?.[
          date
        ]?.stationaryWorkersLimit;
        this.isOpenForCottageWorkers = this.slots?.[
          date
        ]?.isOpenForCottageWorkers;

        this.dialog = true;
      }
    },
    submitSlotForm() {
      if (this.$refs.slotForm.validate()) {
        const { stationaryWorkersLimit, isOpenForCottageWorkers } = this;

        this.slots[this.date] = {
          stationaryWorkersLimit,
          isOpenForCottageWorkers
        };

        this.dialog = false;
      }
    }
  }
};
</script>
