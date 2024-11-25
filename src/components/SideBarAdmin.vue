<template>
  <v-app-bar-nav-icon color="brown">
    <div class="text-center">
      <v-dialog v-model="progressBar" width="100" hide-overlay>
        <v-progress-circular
          :size="60"
          color="primary"
          indeterminate
          align-center
          justify-center
        >
        </v-progress-circular>
      </v-dialog>
    </div>
    <v-btn @click.stop="drawer = !drawer" icon color="black" large>
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="drawer"
      app
      color="brown"
      padless
      mini-variant
      mini-variant-width="200"
    >
      <br />
      <br />
      <v-row>
        <v-col cols="12" md="12">
          <v-icon style="color: black" @click="admin" size="100px"
            >mdi-account
          </v-icon>
        </v-col>
        <v-col cols="12" md="12">
          <span style="color: black">{{ user.name }}</span>
        </v-col>
      </v-row>
      <br />
      <v-list flat class="mt-0">
        <v-list-item-group v-model="selectedItem">
          <v-list-item
            v-for="(item, i) in user.roles == 'ADMIN' ? items : items_staff"
            :key="i"
            :to="item.route"
            :active-class="item.style"
            :disabled="item.disabled"
            :ripple="false"
          >
            <v-list-item-content>
              <v-chip style="background-color: white; height: 50px">
                <v-icon v-text="item.icon"></v-icon>
                <v-list-item-title v-text="item.text"> </v-list-item-title>
              </v-chip>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <br />
        <br />
        <v-tooltip right color="info">
          <template v-slot:activator="{ on, attrs }">
            <v-chip color="black" dark v-bind="attrs" v-on="on" @click="logout">
              Logout
            </v-chip>
          </template>
          <span>Your Logout</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar-nav-icon>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    selectedItem: 0,
    drawer: true,
    items: [
      { text: "Home", route: "/admin", style: "border" },
      { text: "Reservasi", route: "/chair", style: "border" },
      { text: "Makanan", route: "/products-makanan", style: "border" },
      { text: "Minuman", route: "/products-minuman", style: "border" },
      { text: "Snack", route: "/products-snack", style: "border" },
      { text: "Order List", route: "/order", style: "border" },
      { text: "Setting", route: "/store-setting", style: "border" },
    ],
    items_staff: [
      { text: "Home", route: "/admin-customer", style: "border" },
      {
        text: "Reservasi",
        route: "/reservasi-customer",
        style: "border",
      },
      { text: "Makanan", route: "/products-makanan-customer", style: "border" },
      { text: "Minuman", route: "/products-minuman-customer", style: "border" },
      { text: "Snack", route: "/products-snack-customer", style: "border" },
      { text: "Order List", route: "/order-customer", style: "border" },
    ],
    progressBar: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      setting: "setting/setting",
    }),
  },

  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setSetting: "setting/set",
    }),
    go() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let url = "/store-setting";
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          this.store = data;
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },
    admin() {
      this.$router.push("/profile");
    },

    logout() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      this.axios
        .post("/logout", {}, config)
        .then(() => {
          this.isHome();
          this.setAuth({}); // kosongkan auth ketika logout
          this.setAlert({
            status: true,
            color: "success",
            text: "Logout successfully",
          });
        })
        .catch((error) => {
          let { data } = error.response;
          this.setAlert({
            status: true,
            color: "error",
            text: data.message,
          });
        });
    },
    isHome() {
      return this.$router.push({ path: "/" });
    },
  },
  created() {
    this.go();
  },
};
</script>

<style>
.border {
  margin-left: 8px;
  margin-right: 8px;
  background: #1b5e20;
  border-radius: 10px;
  text-decoration: none;
}

.v-list-item-group .v-list-item--active {
  color: white !important;
}

.theme--light.v-list-item--active .v-list-item__subtitle,
.theme--light.v-list-item .v-list-item__action-text {
  color: white !important;
}
</style>
