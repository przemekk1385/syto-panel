<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="8">
        <v-sheet color="white" elevation="12" rounded width="100%">
          <v-window v-model="step" vertical>
            <v-window-item :value="1">
              <v-row>
                <v-col cols="8">
                  <v-container fluid>
                    <v-form>
                      <v-row>
                        <v-col>
                          <span class="cyan--text title">Logowanie</span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            label="Email"
                            prepend-icon="mdi-at"
                            type="text"
                          />
                          <v-text-field
                            label="Hasło"
                            prepend-icon="mdi-lock"
                            type="password"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex">
                          <v-spacer></v-spacer>
                          <v-btn color="cyan" dark rounded>Zaloguj</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-col>
                <v-col cols="4" class="pl-0">
                  <v-sheet color="cyan" dark class="rounded-r" height="100%">
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

            <v-window-item :value="2">
              <v-row>
                <v-col>
                  <v-container fluid>
                    <v-form>
                      <v-row>
                        <v-col class="align-center d-flex">
                          <div class="cyan--text title">Rejestracja</div>
                          <v-spacer></v-spacer>
                          <v-btn icon large>
                            <v-icon color="cyan" large @click="step = 1">
                              mdi-close-circle-outline
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            dense
                            label="Email"
                            prepend-inner-icon="mdi-at"
                            type="text"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            dense
                            label="Hasło"
                            prepend-inner-icon="mdi-lock"
                            type="password"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            dense
                            label="Powtórz hasło"
                            type="password"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            dense
                            label="Imię"
                            prepend-inner-icon="mdi-account"
                            type="text"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field dense label="Nazwisko" type="text" />
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
                            dense
                            label="Telefon"
                            prepend-inner-icon="mdi-phone"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-textarea
                            dense
                            label="Adres"
                            prepend-inner-icon="mdi-map-marker"
                            rows="3"
                          >
                          </v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-select
                            dense
                            :items="workerGroup"
                            label="Rodzaj pracy"
                            prepend-inner-icon="mdi-tools"
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <v-switch
                            dense
                            label="jestem nowym pracownikiem"
                            hide-details
                          ></v-switch>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col class="d-flex">
                          <v-spacer></v-spacer>
                          <v-btn color="cyan" dark rounded>Wyślij</v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
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
export default {
  data: () => ({
    dateOfBirth: undefined,
    datePicker: false,

    step: 1,
    workerGroup: [
      { text: "Pracownik stacjonarny", value: "stationary" },
      { text: "Chałupnik", value: "cottage" }
    ]
  }),
  props: {
    source: String
  },
  methods: {}
};
</script>
