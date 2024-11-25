<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-container
        fluid
        id="scroll-target"
        style="height: 500px"
        class="overflow-y-auto"
      >
        <v-carousel cycle hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item
            v-for="(item, i) in list_images"
            :key="i"
            :src="getImage('/' + item.image_url)"
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </div>
    <br />
    <br />
    <br />
    <v-footer light padless>
      <v-card class="flex" flat tile>
        <v-card-text class="py-2 black--text text-center">
          <v-btn @click="back">
            <v-icon>mdi-arrow-left-circle</v-icon>

            Kembali
          </v-btn>
          <v-btn color="transparent" :elevation="0"></v-btn>
          <v-btn @click="forward">
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
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    forward() {
      return this.$router.push({ path: "/reservasi-customer" });
    },
    back() {
      return this.$router.push({ path: "/admin-customer" });
    },
  },
  data: () => ({
    list_images: [],
  }),
  created() {
    this.axios
      .get("/commonImage/slider")
      .then((response) => {
        let { data } = response.data;
        this.list_images = data;
      })
      .catch((error) => {
        let { responses } = error;
        console.log(responses);
      });
  },
  components: {
    SideBarAdmin,
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
