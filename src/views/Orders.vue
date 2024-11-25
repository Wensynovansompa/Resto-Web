<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-tabs color="#1b5e20">
        <v-tab>New Orders </v-tab>
        <v-tab>History Orders</v-tab>
        <v-tab-item>
          <v-card>
            <v-card-text class="grey lighten-4">
              <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
              <v-subheader> New Orders </v-subheader>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="keyword"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  @input="doSearch"
                >
                </v-text-field>
              </v-card-title>
              <v-data-table
                ref="vDataTable"
                :headers="headers"
                :items="orders"
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
                    <td>
                      <v-icon large color="green" @click="approvedItem(item)">
                        mdi-check
                      </v-icon>
                    </td>
                    <td>
                      <router-link
                        :to="{ name: 'report-order', params: { id: item.id } }"
                      >
                        <v-icon large class="mr-2"> mdi-magnify </v-icon>
                      </router-link>
                      <v-icon large @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
              <div class="text-center">
                <v-pagination
                  v-model="page"
                  @input="go"
                  :length="lengthPage"
                  :total-visible="5"
                  color="green accent-3"
                >
                </v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text class="grey lighten-4">
              <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
              <v-subheader> History Orders </v-subheader>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="keywordHistory"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  @input="doSearchHistory"
                >
                </v-text-field>
              </v-card-title>
              <v-data-table
                ref="vDataTableHistory"
                :headers="headersHistory"
                :items="ordersHistory"
                hide-default-footer
                class="elevation-0"
              >
                <template #item="{ item, index, headersHistory }">
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
                    <td>
                      <v-icon large color="blue"> mdi-check-decagram </v-icon>
                    </td>
                    <td>
                      <router-link
                        :to="{ name: 'report-order', params: { id: item.id } }"
                      >
                        <v-icon large class="mr-2"> mdi-magnify </v-icon>
                      </router-link>
                      <v-icon large @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
              <div class="text-center">
                <v-pagination
                  v-model="pageHistory"
                  @input="goHistory"
                  :length="lengthPageHistory"
                  :total-visible="5"
                  color="green accent-3"
                >
                </v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <div class="warning text-center">
            <header class="text-h5">Confirmation</header>
          </div>
          <v-card-title class="text-h6"
            >Are you sure you want to delete this Invoice:{{
              editedItem.invoice_number
            }}?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green accent-3"
              class="white--text"
              elevation="2"
              @click="closeDelete"
              >Cancel</v-btn
            >
            <v-btn
              color="green accent-3"
              class="white--text"
              elevation="2"
              @click="deleteItemConfirm"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="progressBar" width="100" hide-overlay>
        <v-progress-circular
          :size="60"
          color="primary"
          indeterminate
          align-center
          justify-center
        ></v-progress-circular>
      </v-dialog>
    </div>
  </v-app>
</template>
<script>
import SideBarAdmin from "../components/SideBarAdmin.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    SideBarAdmin,
  },
  data() {
    return {
      orders: [],
      keyword: "",
      page: 0,
      lengthPage: 0,
      ordersHistory: [],
      keywordHistory: "",
      pageHistory: 0,
      lengthPageHistory: 0,
      headers: [
        { text: "No", value: "id" },
        { text: "Invoice", value: "invoice_number" },
        { text: "Total Price", value: "total_bill" },
        { text: "Date", value: "created_at" },
        { text: "Status", value: "status" },
        { text: "Proof Of Payment" },
        { text: "Done" },
        { text: "Actions", sortable: false },
      ],
      headersHistory: [
        { text: "No", value: "id" },
        { text: "Invoice", value: "invoice_number" },
        { text: "Total Price", value: "total_bill" },
        { text: "Date", value: "created_at" },
        { text: "Status", value: "status" },
        { text: "Proof Of Payment" },
        { text: "Done" },
        { text: "Actions", sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      editedItem: {
        id: "",
      },
      defaultItem: {
        id: "",
      },
      progressBar: false,
      id: "",
      image_download: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },

  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    go() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let url = "/orders?page=" + this.page;
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.orders = data;
          this.lengthPage = meta.last_page;
          this.page = meta.current_page;
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
      let url = "/orders-history?page=" + this.page;
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.ordersHistory = data;
          this.lengthPageHistory = meta.last_page;
          this.pageHistory = meta.current_page;
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },
    doSearch() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let keyword = this.keyword;
      if (keyword.length > 0) {
        this.axios
          .get("/orders/search/" + keyword, config)
          .then((response) => {
            let { data } = response.data;
            this.orders = data;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.go();
      }
    },
    doSearchHistory() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let keyword = this.keywordHistory;
      if (keyword.length > 0) {
        this.axios
          .get("/orders/search-history/" + keyword, config)
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
    approvedItem(item) {
      this.progressBar = true;
      this.editedItem = Object.assign({}, item);
      let formData = new FormData();
      formData.set("id", this.editedItem.id);
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      this.axios
        .post("/orders/approved", formData, config)
        .then((response) => {
          let { data } = response;
          this.setAuth(data.data);
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.progressBar = false;
          this.go();
          this.goHistory();
        })
        .catch((error) => {
          let { data } = error;
          this.setAlert({
            status: true,
            text: data.message,
            color: "error",
          });
          this.progressBar = false;
          this.go();
          this.goHistory();
        });
    },
    deleteItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.progressBar = true;
      let formData = new FormData();
      formData.set("id", this.editedItem.id);
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      this.axios
        .post("/orders/delete-permanent", formData, config)
        .then((response) => {
          let { data } = response;
          this.setAuth(data.data);
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.orders.splice(this.editedIndex, 1);
          this.closeDelete();
          this.orders.push(this.editedItem);
          this.go();
          this.goHistory();
          this.progressBar = false;
        })
        .catch((error) => {
          let { data } = error;
          this.setAlert({
            status: true,
            text: data.message,
            color: "error",
          });
          this.orders.push(this.editedItem);
          this.go();
          this.goHistory();
          this.progressBar = false;
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.go();
    this.goHistory();
  },
};
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}

.position-relative {
  position: relative;
}
</style>
