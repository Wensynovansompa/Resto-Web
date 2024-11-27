<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-card-text class="grey lighten-4">
        <v-row>
          <v-col cols="4" sm="4" md="4">
            <img
              :src="getImage('/' + editedItem.logo_path_url)"
              height="200px"
              width="300px"
              contain
            />
          </v-col>
          <v-col cols="8" sm="8" md="8">
            <v-textarea v-model="editedItem.store" disabled> </v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-tabs color="#1b5e20">
        <v-tab>Shopping cart</v-tab>
        <v-tab>History Orders</v-tab>
        <v-tab-item>
          <v-card>
            <v-container
              fluid
              id="scroll-target"
              style="height: 300px"
              class="overflow-y-auto"
            >
              <div v-if="countCart === 0">
                <v-alert outlined color="warning" icon="mdi-cart-off">
                  Empty shopping cart!
                </v-alert>
              </div>
              <v-simple-table
                v-if="countCart > 0"
                v-scroll:#scroll-target="onScroll"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Price</th>
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in carts" :key="'cart' + index">
                      <td style="width: 30%">
                        {{ item.title }}
                      </td>

                      <td style="width: 30%">{{ item.price }}</td>
                      <td style="width: 30%">
                        <v-btn
                          icon
                          small
                          rounded
                          depressed
                          @click.stop="removeCart(item)"
                        >
                          <v-icon dark color="error">mdi-minus-circle</v-icon>
                        </v-btn>
                        {{ item.quantity }}
                        <v-btn
                          icon
                          small
                          rounded
                          depressed
                          @click.stop="addCart(item)"
                        >
                          <v-icon dark color="success">mdi-plus-circle</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
            <v-card-text>
              <span> {{ chairName }}</span>
              <br />
              <v-col cols="bg" class="text-center"
                ><v-layout wrap>
                  <v-flex pa-1 xs6>
                    <span class="title"
                      >Total Rp. {{ totalPrice.toLocaleString("id-ID") }}</span
                    >
                  </v-flex>

                  <v-flex pa-1 xs6 v-if="!guest">
                    <div v-if="countCart != 0 && this.chairId != null">
                      <v-btn
                        color="#1b5e20"
                        @click="checkout"
                        :disabled="totalQuantity == 0"
                        class="white--text"
                      >
                        <v-icon color="white">mdi-cart-arrow-right</v-icon>
                        &nbsp; Checkout
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-col>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="keywordHistory"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                @input="doSearchHistoryMyOrder"
              >
              </v-text-field>
            </v-card-title>
            <v-data-table
              ref="vDataTableHistory"
              :headers="headers"
              :items="ordersHistory"
              hide-default-footer
              class="elevation-0"
            >
              <template #item="{ item, index, headers }">
                <tr>
                  <td>
                    {{ index + 1 + (page - 1) * 10 }}
                  </td>
                  <td>
                    {{ item.invoice_number }}
                  </td>
                  <td>Rp. {{ item.total_bill }}</td>
                  <td>
                    {{ item.updated_at }}
                  </td>
                  <td>
                    {{ item.status }}
                  </td>
                  <td>
                    <router-link
                      :to="{ name: 'payment-order', params: { id: item.id } }"
                    >
                      <v-icon large class="mr-2" color="blue">
                        mdi-download-box
                      </v-icon>
                    </router-link>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div class="text-center">
              <v-pagination
                v-model="page"
                @input="goHistory"
                :length="lengthPage"
                :total-visible="5"
                color="green accent-3"
              >
              </v-pagination>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs>

      <div class="text-center">
        <v-dialog v-model="dialogCheckout" class="blue---text" max-height="500">
          <v-overlay :absolute="absolute" :value="overlay">
            <v-row align="center" justify="center">
              <v-overlay color="White" :absolute="absolute" :value="progress">
                <div class="text-center">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="blue"
                    indeterminate
                  >
                  </v-progress-circular>
                </div>
              </v-overlay>
            </v-row>
            <v-card color="white" style="height: auto; width: 350px">
              <v-container style="height: auto">
                <v-row justify="center">
                  <v-col cols="12" sm="6">
                    <h1>
                      <span class="black--text ml-0 caption"
                        >Total Pembayaran</span
                      >
                    </h1>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <h1>
                      <span class="black--text ml-0 caption"
                        >Rp. {{ totalPrice.toLocaleString("id-ID") }}</span
                      >
                    </h1>
                  </v-col>
                </v-row>
                <h1>
                  <span class="black--text ml-0 caption">
                    Upload Bukti Pembayaran</span
                  >

                  <v-list-item-content
                    ><input
                      type="file"
                      @change="onFileSelected"
                      ref="avatar"
                      class="black--text ml-0 caption"
                    />
                  </v-list-item-content>
                </h1>

                <v-card-actions>
                  <v-btn
                    width="100"
                    color="#1b5e20"
                    @click="(overlay = false), (dialogCheckout = false)"
                  >
                    <v-text-title class="white--text caption"
                      >Cancel</v-text-title
                    >
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="#1b5e20" @click="pay" width="100">
                    <v-text-title class="white--text caption"
                      >Send</v-text-title
                    >
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-overlay>
        </v-dialog>
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
  },
  data: () => ({
    absolute: true,
    overlay: false,
    dialogCheckout: false,
    progress: false,
    orderId: "",
    orders: "",
    keywordHistory: "",
    page: 0,
    lengthPage: 0,
    ordersHistory: [],
    headers: [
      { text: "No", value: "id" },
      { text: "Invoice", sortable: false },
      { text: "Total Price", sortable: false },
      { text: "Date", sortable: false },
      { text: "Status", sortable: false },
      { text: "Proof Of Payment", sortable: false },
    ],
    selectedFile: null,
    editedItem: {
      store: "",
      logo_path_url: "",
    },
  }),
  computed: {
    ...mapGetters({
      carts: "cart/carts",
      countCart: "cart/count",
      totalPrice: "cart/totalPrice",
      totalQuantity: "cart/totalQuantity",
      totalStock: "cart/totalStock",
      user: "auth/user",
      guest: "auth/guest",
      setting: "setting/setting",
      flatform: "flatform/flatform",
      chairName: "chair/chairName",
      chairId: "chair/chairId",
    }),
  },
  created() {
    this.go();
    this.goHistory();
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      addCart: "cart/add",
      removeCart: "cart/remove",
      setCart: "cart/set",
      setAuth: "auth/set",
      setSetting: "setting/set",
      setChairId: "chair/setId",
      setName: "chair/setName",
    }),
    checkout() {
      this.dialogCheckout = true;
      this.overlay = true;
    },
    close() {
      this.$emit("closed", false);
    },
    back() {
      return this.$router.push({
        path: "/products-snack-customer",
      });
    },

    pay() {
      if (this.selectedFile != null) {
        this.progress = true;
        let safeCart = JSON.stringify(this.carts);
        let formData = new FormData();
        formData.set("carts", safeCart);
        formData.set("chairId", this.chairId);
        formData.set("image", this.selectedFile);
        let config = {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        };
        this.axios
          .post("/payment-pos", formData, config)
          .then((response) => {
            let { data } = response;
            this.orderId = data.data.order_id;
            if (data && data.status == "success") {
              this.setCart([]);
              this.setChairId(null);
              this.setName(null);
              this.progress = false;
              this.dialogCheckout = false;
              this.selectedFile = null;
              this.succesPay();
            } else {
              this.progress = false;
              this.overlay = false;
              this.selectedFile = null;
              this.setAlert({
                status: true,
                text: data.message,
                color: data.status,
              });
            }
          })
          .catch((error) => {
            this.progress = false;
            let { data } = error.response;
            this.setAlert({
              status: true,
              text: data.message,
              color: "error",
            });
          });
      } else {
        this.setAlert({
          status: true,
          text: "Mohon upload bukti pembayaran dulu!",
          color: "error",
        });
      }
    },
    succesPay() {
      this.overlay = false;
      this.dialogCheckout = false;
      this.$router.push({
        path: "/admin-customer",
      });
    },
    refreshData() {
      window.location.reload();
    },

    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
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
          this.editedItem = data;
          this.setSetting(data);
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },
    goHistory() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let url = "/my-order?page=" + this.page;
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.ordersHistory = data;
          this.lengthPage = meta.last_page;
          this.page = meta.current_page;
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },
    doSearchHistoryMyOrder() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let keyword = this.keywordHistory;
      if (keyword.length > 0) {
        this.axios
          .get("/orders/search-history-my-order/" + keyword, config)
          .then((response) => {
            let { data } = response.data;
            this.ordersHistory = data;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.goHistory();
      }
    },
  },
};
</script>
