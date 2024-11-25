<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-card>
        <v-card-text class="grey lighten-4">
          <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
          <v-subheader> Daftar Meja </v-subheader>
          <v-card-title>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#1b5e20"
                  class="white--text"
                  elevation="2"
                  v-bind="attrs"
                  v-on="on"
                  >Add Chair</v-btn
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
                            v-model="editedItem.name"
                            label="Name"
                            required
                            :rules="nameRules"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field
                            v-model="editedItem.no"
                            label="No"
                            required
                            :rules="noRules"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-select
                            v-model="editedItem.status"
                            :items="items"
                            label="Select Status"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green accent-3" class="white--text" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="green accent-3" class="white--text" text @click="save">
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
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this {{ editedItem.name }} ?
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
            :items="chairs"
            hide-default-footer
            class="elevation-0"
          >
            <template #item="{ item, index, headers }">
              <tr>
                <td>
                  {{ index + 1 + (page - 1) * 10 }}
                </td>
                <td>
                  {{ item.name }}
                </td>
                <td>
                  {{ item.no }}
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
              color="green accent-3"
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
    chairs: [],
    keyword: "",
    page: 0,
    lengthPage: 0,
    headers: [
      { text: "No", value: "id" },
      { text: "Name", value: "name" },
      { text: "No", value: "no" },
      { text: "Actions", sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      no: "",
    },
    defaultItem: {
      name: "",
      no: "",
    },
    progressBar: false,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Max 20 characters",
    ],
    noRules: [(v) => !!v || "no is required"],
    items: ["terpakai", "tidak terpakai"],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Chair" : "Edit Chair";
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
      let url = "/chairs?page=" + this.page;
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.chairs = data;
          // jumlah halaman di dapat dari meta endpoint chairs
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
          .get("/chairs/search/" + keyword, config)
          .then((response) => {
            let { data } = response.data;
            this.chairs = data;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.go();
      }
    },
    editItem(item) {
      this.editedIndex = this.chairs.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
      this.editedIndex = this.chairs.indexOf(item);
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
        .post("/chairs/delete-permanent", formData, config)
        .then((response) => {
          let { data } = response;
          this.setAuth(data.data);
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.chairs.splice(this.editedIndex, 1);
          this.closeDelete();
          this.chairs.push(this.editedItem);
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
          this.chairs.push(this.editedItem);
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
        let formData = new FormData();
        formData.set("name", this.editedItem.name);
        formData.set("user_id", this.user.id);
        formData.set("id", this.editedItem.id);
        formData.set("no", this.editedItem.no);
        formData.set("status", this.editedItem.status);
        let config = {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        };
        if (this.editedIndex > -1) {
          Object.assign(this.chairs[this.editedIndex], this.editedItem);
          this.axios
            .post("/chairs/update", formData, config)
            .then((response) => {
              let { data } = response;
              this.setAuth(data.data);
              this.setAlert({
                status: true,
                text: data.message,
                color: "success",
              });
              this.chairs.push(this.editedItem);
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
            .post("/chairs/store", formData, config)
            .then((response) => {
              let { data } = response;
              this.setAuth(data.data);
              this.setAlert({
                status: true,
                text: data.message,
                color: "success",
              });
              this.chairs.push(this.editedItem);
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
    clear() {
      this.go();
      this.close();
      this.progressBar = false;
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
