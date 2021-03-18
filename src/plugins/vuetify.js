import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import VueI18n from "vue-i18n";

import { en, pl } from "vuetify/lib/locale";

Vue.use(Vuetify);
Vue.use(VueI18n);

const messages = {
  en: {
    $vuetify: en
  },
  pl: {
    $vuetify: pl
  }
};

const i18n = new VueI18n({
  locale: "pl",
  fallbackLocale: "en",
  messages
});

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
});
