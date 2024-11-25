<template>
  <v-app>
    <SideBarAdmin />

    <div>
      <v-container
        grid-list-sm
        v-if="chairs"
        fluid
        id="scroll-target"
        style="height: 600px"
        class="overflow-y-auto"
      >
        <v-layout wrap>
          <v-flex v-for="chair in chairs" :key="`chair-` + chair.id" xs2>
            <chair-item :chair="chair" height="100px" width="100px" />
          </v-flex>
        </v-layout>
      </v-container>
      <v-text-title class="black--text">Tipe meja: {{ chairName }}</v-text-title>
      <div>
        <template>
          <div class="text-center">
            <v-pagination
              v-model="page"
              @input="selectChair()"
              :length="lengthPage"
              :total-visible="5"
              v-if="chairs != 0"
              color="#1b5e20"
            >
            </v-pagination>
          </div>
        </template>
      </div>
    </div>

    <v-footer light padless>
      <v-card class="flex" flat tile>
        <v-card-text class="py-2 black--text text-center">
          <v-btn @click="back">
            <v-icon>mdi-arrow-left-circle</v-icon>

            Kembali
          </v-btn>
          <v-btn color="transparent" :elevation="0"></v-btn>
          <v-btn @click="forward" :disabled="chairId == null">
            Lanjut
            <v-icon>mdi-arrow-right-circle</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import SideBarAdmin from "../components/SideBarAdmin.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    SideBarAdmin,
    ChairItem: () =>
      import(/* webpackChunkName: "chair-item" */ "@/components/ChairItem.vue"),
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
      chairName: "chair/chairName",
      chairId: "chair/chairId",
    }),
  },
  created() {
    this.setChairName(null);
    this.setChairId(null);
    this.selectChair();
  },
  data: () => ({
    chairs: [],
    page: 0,
    lengthPage: 0,
  }),
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setChairName: "chair/setName",
      setChairId: "chair/setId",
    }),
    forward() {
      return this.$router.push({ path: "/products-makanan-customer" });
    },
    back() {
      return this.$router.push({ path: "/admin-customer" });
    },
    selectChair() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let url = "/chairs-customer";
      url = url + "?page=" + this.page;
      url = encodeURI(url);
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.chairs = data;
          this.lengthPage = meta.last_page;
          this.page = meta.current_page;
          if (this.chairs == 0) {
            this.setAlert({
              status: true,
              color: "warning",
              text: "Empty chair : please add chairs for this category!",
            });
          }
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },
  },
};
</script>
<style>
.v-card.borderme {
  border: 2px solid #704232 !important;
}

.v-card.borderout {
  border: 1px solid #bcaaa4 !important;
}
</style>
