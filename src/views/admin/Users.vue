<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3">Pracownicy</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          class="elevation-1"
          :headers="headers"
          :footer-props="footerProps"
          :items="items"
          item-key="id"
          pagination.sync="pagination"
        >
          <template v-slot:[`item.groups`]="{ item: { groups } }">
            <v-icon v-for="icon in getGroupsIcons(groups)" :key="icon">
              {{ icon }}
            </v-icon>
          </template>
          <template
            v-slot:[`item.isActive`]="{ index, item: { id, isActive } }"
          >
            <v-simple-checkbox
              v-if="!isMe(id)"
              :value="isActive"
              :ripple="false"
              @input="performToggleIsActive(index)"
            ></v-simple-checkbox> </template
          >x
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Users",
  data: () => ({
    footerProps: {
      itemsPerPageOptions: [20, 50, 100]
    },

    headers: [
      {
        text: "Imię",
        value: "firstName",
        sortable: false
      },
      {
        text: "Nazwisko",
        value: "lastName"
      },
      {
        text: "Email",
        value: "email",
        sortable: false
      },
      {
        text: "Data urodzenia",
        value: "dateOfBirth"
      },
      {
        text: "Telefon",
        value: "phoneNumber",
        sortable: false
      },
      {
        text: "Adres",
        value: "address",
        sortable: false
      },
      {
        text: "Grupy",
        value: "groups"
      },
      {
        text: "Aktywny",
        value: "isActive"
      }
    ],
    items: []
  }),
  computed: {
    ...mapState(["me"])
  },
  async mounted() {
    const items = await this.userList();
    this.items = items;
  },
  methods: {
    ...mapActions({
      userList: "userList",
      userToggleIsActive: "userToggleIsActive"
    }),

    async performToggleIsActive(i) {
      const { id } = this.items?.[i] || {};
      const { isActive } = await this.userToggleIsActive(id);

      if (isActive || (!isActive && isActive !== undefined)) {
        this.items[i].isActive = !this.items[i].isActive;
      }
    },

    getGroupsIcons(groups) {
      const icons = {
        foreman: "mdi-cog-outline",
        cottage_worker: "mdi-home-city-outline",
        stationary_worker: "mdi-factory",
        new_employee: "mdi-new-box"
      };
      return groups.map(group => icons[group]);
    },
    isMe(id) {
      const { id: meId } = this.me;

      return meId === id;
    }
  }
};
</script>
