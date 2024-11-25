<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-card>
        <v-card-text class="grey lighten-4">
          <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
          <v-subheader> Daftar Banner Iklan </v-subheader>
          <v-card-title>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#1b5e20"
                  class="white--text"
                  elevation="2"
                  v-bind="attrs"
                  v-on="on"
                  >Add Banner</v-btn
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
                          <label>Banner</label>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <img
                            :src="getImage('/' + editedItem.image_url)"
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
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green accent-3"
                    class="white--text"
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="green accent-3"
                    class="white--text"
                    text
                    @click="save"
                  >
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
          </v-card-title>
          <v-data-table
            ref="vDataTable"
            :headers="headers"
            :items="informations"
            hide-default-footer
            class="elevation-0"
          >
            <template #item="{ item, index, headers }">
              <tr>
                <td>
                  {{ index + 1 + (page - 1) * 10 }}
                </td>
                <td>
                  <v-img
                    :src="getImage('/' + item.image_url)"
                    :alt="item.name"
                    max-height="100px"
                    max-width="100px"
                  ></v-img>
                </td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
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
    informations: [],
    keyword: "",
    page: 0,
    lengthPage: 0,
    headers: [
      { text: "No", value: "id" },
      { text: "Banner", value: "image_url" },
      { text: "Actions", sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      image: "",
    },
    defaultItem: {
      image: "",
    },
    selectedFile: null,
    progressBar: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Banner" : "Edit Banner";
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
      let url = "/informations?page=" + this.page;
      this.axios
        .get(url, config)
        .then((response) => {
          let { data } = response.data;
          let { meta } = response.data;
          this.informations = data;
          // jumlah halaman di dapat dari meta endpoint informations
          this.lengthPage = meta.last_page;
          this.page = meta.current_page;
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },

    editItem(item) {
      this.editedIndex = this.informations.indexOf(item);
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
      this.editedIndex = this.informations.indexOf(item);
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
        .post("/informations/delete-permanent", formData, config)
        .then((response) => {
          let { data } = response;
          this.setAuth(data.data);
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.informations.splice(this.editedIndex, 1);
          this.closeDelete();
          this.informations.push(this.editedItem);
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
          this.informations.push(this.editedItem);
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
        formData.set("image", this.selectedFile);
        formData.set("user_id", this.user.id);
        formData.set("id", this.editedItem.id);
        let config = {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        };
        if (this.editedIndex > -1) {
          Object.assign(this.informations[this.editedIndex], this.editedItem);
          this.axios
            .post("/informations/update", formData, config)
            .then((response) => {
              let { data } = response;
              this.setAuth(data.data);
              this.setAlert({
                status: true,
                text: data.message,
                color: "success",
              });
              this.informations.push(this.editedItem);
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
            .post("/informations/store", formData, config)
            .then((response) => {
              let { data } = response;
              this.setAuth(data.data);
              this.setAlert({
                status: true,
                text: data.message,
                color: "success",
              });
              this.informations.push(this.editedItem);
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
