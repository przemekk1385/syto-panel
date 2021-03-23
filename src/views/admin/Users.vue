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
          <template v-slot:[`item.isActive`]="{ item }">
            <v-simple-checkbox
              v-model="item.isActive"
              :ripple="false"
            ></v-simple-checkbox>
          </template>

          <!--
          <template v-slot:[`item.actions`]="{ item: { id, isActive } }">
            <v-btn class="mx-2" icon @click="toggleIsActive(id)">
              <v-icon v-if="isActive" small>
                mdi-checkbox-blank
              </v-icon>
              <v-icon v-else color="success" small>
                mdi-checkbox-marked
              </v-icon>
            </v-btn>
          </template>

          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
              Reset
            </v-btn>
          </template>
          //-->
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Users",
  data: () => ({
    expanded: [],
    footerProps: {
      itemsPerPageOptions: [20, 50, 100]
    },

    today: "2021-03-03",
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
    items: [
      {
        id: 1,
        firstName: "Foo",
        lastName: "Bar",
        email: "foo@bar.baz",
        dateOfBirth: "2020-01-01",
        phoneNumber: "+48 666 666 666",
        address: "Foo Foo Foo, Bar Bar",
        groups: ["cottage_worker", "new_employee"],
        isActive: true
      },
      {
        id: 2,
        firstName: "Foo",
        lastName: "Bar",
        email: "foo@bar.baz",
        dateOfBirth: "2020-01-01",
        phoneNumber: "+48 666 666 666",
        address: "Foo Foo Foo, Bar Bar",
        groups: ["stationary_worker", "new_employee", "foreman"],
        isActive: false
      },
      {
        id: 3,
        firstName: "Foo",
        lastName: "Bar",
        email: "foo@bar.baz",
        dateOfBirth: "2020-01-01",
        phoneNumber: "+48 666 666 666",
        address: "Foo Foo Foo, Bar Bar",
        groups: ["cottage_worker", "new_employee"],
        isActive: true
      }
    ]
  }),
  computed: {},
  mounted() {},
  methods: {
    getGroupsIcons(groups) {
      const icons = {
        foreman: "mdi-cog-outline",
        cottage_worker: "mdi-home-city-outline",
        stationary_worker: "mdi-factory",
        new_employee: "mdi-new-box"
      };
      return groups.map(group => icons[group]);
    },
    toggleIsActive(id) {
      const i = this.items.map(({ id }) => id).indexOf(id);
      this.items[i].isActive = !this.items[i].isActive;
    }
  }
};
</script>
