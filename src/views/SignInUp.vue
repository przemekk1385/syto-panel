<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="8">
        <v-sheet color="white" elevation="12" rounded width="100%">
          <v-window v-model="step">
            <v-window-item
              reverse-transition="v-fade-transition"
              transition="v-fade-transition"
              :value="1"
            >
              <v-row>
                <v-col cols="8">
                  <v-container fluid>
                    <v-form ref="loginForm">
                      <v-row>
                        <v-col>
                          <span class="primary--text title">Logowanie</span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="email"
                            label="Email"
                            prepend-icon="mdi-at"
                            :rules="[rules.required]"
                            type="text"
                          />
                          <v-text-field
                            v-model="password"
                            label="Hasło"
                            prepend-icon="mdi-lock"
                            :rules="[rules.required]"
                            type="password"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            dark
                            rounded
                            @click="submitLoginForm"
                            >Zaloguj</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-col>
                <v-col cols="4" class="pl-0">
                  <v-sheet color="primary" dark class="rounded-r" height="100%">
                    <v-container fill-height fluid class="text-center">
                      <v-row>
                        <v-col>
                          <span class="title">SYTO Wadowice</span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <p class="body-1">
                            Utwórz konto, jako obecny lub nowy pracownik.
                          </p>
                          <p class="body-1">
                            Wybierz pracę chałupniczą lub stacjonarną.
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-btn rounded outlined dark @click="step = 2"
                            >Zarejestruj się</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item
              reverse-transition="v-fade-transition"
              transition="v-fade-transition"
              :value="2"
            >
              <v-row>
                <v-col>
                  <v-container fluid>
                    <v-form ref="registrationForm">
                      <v-row>
                        <v-col class="d-flex">
                          <div class="primary--text title">Rejestracja</div>
                          <v-spacer></v-spacer>
                          <v-btn icon large>
                            <v-icon color="primary" large @click="step = 1">
                              mdi-close-circle-outline
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="email"
                            dense
                            :error-messages="errorMessages.email"
                            label="Email"
                            prepend-inner-icon="mdi-at"
                            :rules="[rules.required]"
                            type="text"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="password"
                            dense
                            label="Hasło"
                            prepend-inner-icon="mdi-lock"
                            :rules="[rules.required, validatePasswordMatch]"
                            type="password"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="confirmPassword"
                            dense
                            label="Powtórz hasło"
                            :rules="[rules.required]"
                            type="password"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="firstName"
                            dense
                            label="Imię"
                            prepend-inner-icon="mdi-account"
                            :rules="[rules.required]"
                            type="text"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="lastName"
                            dense
                            label="Nazwisko"
                            :rules="[rules.required]"
                            type="text"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
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
                                v-model="dateOfBirth"
                                dense
                                label="Data urodzenia"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                :rules="extraRules"
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateOfBirth"
                              first-day-of-week="1"
                              landscape
                              locale="pl"
                              @input="datePicker = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="phoneNumber"
                            dense
                            :error-messages="errorMessages.phoneNumber"
                            label="Telefon"
                            prepend-inner-icon="mdi-phone"
                            :rules="extraRules"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-textarea
                            v-model="address"
                            dense
                            label="Adres"
                            prepend-inner-icon="mdi-map-marker"
                            :rules="extraRules"
                            rows="3"
                          >
                          </v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-select
                            v-model="workerGroup"
                            dense
                            :items="workerGroupItems"
                            label="Rodzaj pracy"
                            prepend-inner-icon="mdi-tools"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-switch
                            v-model="isNew"
                            dense
                            label="jestem nowym pracownikiem"
                            hide-details
                          ></v-switch>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col class="d-flex">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            dark
                            rounded
                            class="mr-2"
                            @click="submitRegistrationForm"
                            >Wyślij</v-btn
                          >
                          <v-btn
                            color="warning"
                            dark
                            rounded
                            @click="resetRegistrationForm"
                            >Wyczyść</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item
              reverse-transition="v-fade-transition"
              transition="v-fade-transition"
              :value="3"
            >
              <v-row>
                <v-col>
                  <v-container fluid>
                    <v-row>
                      <v-col class="d-flex">
                        <div class="primary--text title">
                          Rejestracja zakończona
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon large>
                          <v-icon color="primary" large @click="step = 1">
                            mdi-close-circle-outline
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <p class="body-1">
                          Użytkownik o adresie {{ email }} został utworzony.
                          Przed rozpoczęciem korzystania z serwisu konto musi
                          zostać aktywowane przez administratora.
                        </p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    step: 1,
    workerGroupItems: [
      { text: "Pracownik stacjonarny", value: "stationary" },
      { text: "Chałupnik", value: "cottage" }
    ],

    // registration form
    confirmPassword: undefined,
    firstName: undefined,
    lastName: undefined,
    dateOfBirth: undefined,

    phoneNumber: undefined,
    address: undefined,
    workerGroup: undefined,
    isNew: undefined,

    datePicker: false,
    emailErrorMessages: [],
    errorMessages: {},

    // common form stuff
    email: undefined,
    password: undefined,
    rules: {
      required: val => !!val || "To pole jest wymagane."
    },
    extraRules: []
  }),
  computed: {
    ...mapGetters({ isAuthenticated: "isAuthenticated" }),
    credentials() {
      const { email: username, password } = this;

      return { username, password };
    },
    isCottage() {
      return this.workerGroup === "cottage";
    },
    userPayload() {
      const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        address,
        isNew,
        isCottage
      } = this;

      return {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        address,
        isNew,
        isCottage
      };
    },
    validatePasswordMatch() {
      return (
        this.password === this.confirmPassword || "Hasła nie są identyczne."
      );
    }
  },
  watch: {
    email() {
      this.errorMessages.email = [];
    },
    phoneNumber() {
      this.errorMessages.phoneNumber = [];
    },
    isNew(val) {
      if (val) {
        this.extraRules = [this.rules.required];
      } else {
        this.extraRules = [];
      }
    }
  },
  methods: {
    ...mapActions({ login: "login", register: "register" }),
    async submitLoginForm() {
      if (this.$refs.loginForm.validate()) {
        await this.login(this.credentials);
        if (this.isAuthenticated) {
          this.$router.push({ name: "MyCalendar" });
        }
      }
    },
    async submitRegistrationForm() {
      if (this.$refs.registrationForm.validate()) {
        const { data, ok } = await this.register(this.userPayload);

        if (ok) {
          this.step = 3;
        } else {
          const { email, phoneNumber } = data;

          this.errorMessages = { email, phoneNumber };
        }
      }
    },
    resetRegistrationForm() {
      this.$refs.registrationForm.reset();
      this.errorMessages = {};
    }
  }
};
</script>
