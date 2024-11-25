<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-card>
        <v-card-text class="grey lighten-4">
          <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
          <v-subheader> Daftar Snack </v-subheader>
          <v-card-title>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#1b5e20"
                  class="white--text"
                  elevation="2"
                  v-bind="attrs"
                  v-on="on"
                  >Add Product</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field
                            v-model="editedItem.code"
                            label="Code"
                            :rules="codeRules"
                            disabled
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field
                            v-model="editedItem.title"
                            label="Product Name"
                            required
                            :rules="nameRules"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <label>Cover Image</label>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <img
                            :src="getImage('/' + editedItem.cover)"
                            height="100px"
                            width="100px"
                            contain
                          />
                          <v-file-input
                            truncate-length="15"
                            @change="onFileSelected"
                            ref="fileImage"
                          >
                          </v-file-input>
                        </v-col>

                        <v-col cols="12" sm="6" md="12">
                          <v-textarea
                            v-model="editedItem.description"
                            label="Description"
                            required
                            :rules="descriptionRules"
                            height="100"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field
                            v-model="editedItem.stock"
                            label="Stock"
                            type="number"
                            :rules="stockRules"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field
                            v-model="editedItem.buying_price"
                            label="Buying Price"
                            type="number"
                            required
                            :rules="buying_priceRules"
                            prefix="Rp"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field
                            v-model="editedItem.price"
                            label="Selling Price"
                            type="number"
                            required
                            :rules="priceRules"
                            prefix="Rp"
                            ref="price"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#1b5e20" class="white--text" elevation="2" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="#1b5e20" class="white--text" elevation="2" @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <div class="warning text-center">
                  <header class="text-h5">Confirmation</header>
                </div>
                <v-card-title class="text-h6"
                  >Are you sure you want to delete this {{ editedItem.title }} ?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="#1b5e20"
                    class="white--text"
                    elevation="2"
                    @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="#1b5e20"
                    class="white--text"
                    elevation="2"
                    @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

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
            :items="products"
            hide-default-footer
            class="elevation-0"
          >
            <template #item="{ item, index, headers }">
              <tr>
                <td class="hidden-sm-and-down">
                  {{ index + 1 + (page - 1) * 10 }}
                </td>
                <td class="hidden-sm-and-down">
                  <v-list-item-avatar>
                    <v-img :src="getImage('/' + item.cover)" :alt="item.name"></v-img>
                  </v-list-item-avatar>
                </td>
                <td class="hidden-sm-and-down">
                  {{ item.code }}
                </td>
                <td>
                  {{ item.title }}
                </td>
                <td>
                  {{ item.buying_price }}
                </td>
                <td>
                  {{ item.price }}
                </td>

                <td>
                  {{ item.stock }}
                </td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                  <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
              color="#1b5e20"
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
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
  data: () => ({
    valid: true,
    isDisabled: false,
    products: [],
    keyword: "",
    page: 0,
    lengthPage: 0,
    headers: [
      { text: "No", value: "id", class: "hidden-sm-and-down" },
      { text: "Icon", value: "image", class: "hidden-sm-and-down" },
      { text: "Code", value: "code", class: "hidden-sm-and-down" },
      { text: "Name Product", value: "title" },
      { text: "Buying Price", value: "buying_price" },
      { text: "Price", value: "price" },
      { text: "Stock", value: "stock" },
      { text: "Actions", sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      code: "",
      title: "",
      image: "",
      description: "",
      stock: "",
      buying_price: "",
      price: "",
    },
    defaultItem: {
      code: "",
      title: "",
      image: "",
      description: "",
      stock: "",
      buying_price: "",
      price: "",
    },
    selectedFile: null,
    progressBar: false,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 30) || "Max 30 characters",
    ],
    descriptionRules: [(v) => !!v || "Description is required"],
    stockRules: [(v) => /([0-9])/.test(v) || "Stock must be valid"],
    priceRules: [
      (v) => !!v || "Price is required",
      (v) => /([0-9])/.test(v) || "Price must be valid",
    ],
    buying_priceRules: [
      (v) => !!v || "Buying Price is required",
      (v) => /([0-9])/.test(v) || "Buying Price must be valid",
    ],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Product" : "Edit Product";
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
    this.doSearchProduct();
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
      let url = "/productsSnack?page=" + this.page;
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.products = data;
          // jumlah halaman di dapat dari meta endpoint products
          this.lengthPage = meta.last_page;
          this.page = meta.current_page;
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
          .get("/products/searchSnack/" + keyword, config)
          .then((response) => {
            let { data } = response.data;
            this.products = data;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.go();
      }
    },
    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.category = 3;
      this.doSearchProduct();
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item);
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
        .post("/products/delete-permanent", formData, config)
        .then((response) => {
          let { data } = response;
          this.setAuth(data.data);
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.products.splice(this.editedIndex, 1);
          this.closeDelete();
          this.products.push(this.editedItem);
          this.go();
          this.progressBar = false;
        })
        .catch((error) => {
          let { data } = error;
          this.setAlert({
            status: true,
            text: data.message,
            color: "error",
          });
          this.products.push(this.editedItem);
          this.go();
          this.progressBar = false;
        });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.$refs.form.validate()) {
        this.progressBar = true;
        this.editedItem.category = 3;
        let formData = new FormData();
        formData.set("code", this.editedItem.code);
        formData.set("name", this.editedItem.title);
        formData.set("cover", this.selectedFile);
        formData.set("user_id", this.user.id);
        formData.set("id", this.editedItem.id);
        formData.set("stock", this.editedItem.stock);
        formData.set("description", this.editedItem.description);
        formData.set("buying_price", this.editedItem.buying_price);
        formData.set("price", this.editedItem.price);
        formData.set("category", this.editedItem.category);

        let config = {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        };
        if (this.editedIndex > -1) {
          Object.assign(this.products[this.editedIndex], this.editedItem);
          this.axios
            .post("/products/update", formData, config)
            .then((response) => {
              let { data } = response;
              this.setAuth(data.data);
              this.setAlert({
                status: true,
                text: data.message,
                color: data.status,
              });
              this.products.push(this.editedItem);
              this.clear();
            })
            .catch((error) => {
              let { data } = error;
              this.setAlert({
                status: true,
                text: data.message,
                color: "error",
              });
              this.clear();
            });
        } else {
          this.axios
            .post("/products/store", formData, config)
            .then((response) => {
              let { data } = response;
              this.setAuth(data.data);
              this.setAlert({
                status: true,
                text: data.message,
                color: data.status,
              });
              this.products.push(this.editedItem);
              this.clear();
            })
            .catch((error) => {
              let { data } = error;
              this.setAlert({
                status: true,
                text: data.message,
                color: "error",
              });
              this.clear();
            });
        }
      }
    },
    onFileSelected(event) {
      this.selectedFile = event;
    },
    clear() {
      this.$refs.fileImage.reset();
      this.go();
      this.close();
      this.clearForm();
      this.progressBar = false;
    },

    doSearchProduct() {
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let keyword = this.productKeyword;
      this.isDisabled = true;
      this.axios
        .get("/products/ajaxSearch/" + keyword, config)
        .then((response) => {
          let { data } = response.data;
          this.productsChilds = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clearForm() {
      this.doSearchProduct();
      this.$refs.form.reset();
    },
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
