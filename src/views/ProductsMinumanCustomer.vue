<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-container
        grid-list-sm
        v-if="products"
        fluid
        id="scroll-target"
        style="height: 600px"
        class="overflow-y-auto"
      >
        <v-layout wrap>
          <v-flex v-for="product in products" :key="`product-` + product.id" xs2>
            <product-item :product="product" height="100px" width="100px" />
          </v-flex>
        </v-layout>
      </v-container>
      <div>
        <template>
          <div class="text-center">
            <v-pagination
              v-model="page"
              @input="selectCategory()"
              :length="lengthPage"
              :total-visible="5"
              v-if="products != 0"
              color="#1b5e20"
            >
            </v-pagination>
          </div>
        </template>
      </div>
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
  components: {
    SideBarAdmin,
    ProductItem: () =>
      import(/* webpackChunkName: "product-item" */ "@/components/ProductItem.vue"),
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
    }),
  },
  created() {
    this.selectCategory();
  },
  data: () => ({
    products: [],
    page: 0,
    lengthPage: 0,
  }),
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    forward() {
      return this.$router.push({ path: "/products-snack-customer" });
    },
    back() {
      return this.$router.push({ path: "/products-makanan-customer" });
    },
    selectCategory() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let url = "/categories/slug/minuman";
      url = url + "?page=" + this.page;
      url = encodeURI(url);
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let category = data;
          this.category = category;
          this.products = category.products.data;
          this.page = category.products.current_page;
          this.lengthPage = category.products.last_page;
          if (this.products == 0) {
            this.setAlert({
              status: true,
              color: "warning",
              text: "Empty product : please add products for this category!",
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
