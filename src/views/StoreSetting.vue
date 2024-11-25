<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-card>
        <v-container fluid>
          <v-card-text class="grey lighten-4">
            <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
            <v-subheader> Store Setting </v-subheader>
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <label>Logo Rekening Bank</label>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <img
                          :src="getImage('/' + editedItem.logo_path_url)"
                          height="100px"
                          width="100px"
                          contain
                        />
                        <v-file-input
                          truncate-length="15"
                          @change="onFileSelected"
                          ref="fileLogo"
                          required
                          :rules="logoRules"
                        >
                        </v-file-input>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-textarea
                          v-model="editedItem.store"
                          label="Deskripsi Pembayaran"
                          required
                          :rules="storeRules"
                          height="100"
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
              <v-card-actions class="justify-center">
                <v-btn color="#1b5e20" class="white--text" elevation="2" @click="save">
                  Save
                </v-btn>
                <v-btn @click="reset" color="#1b5e20" class="white--text" elevation="2">
                  Reset
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card-text>
        </v-container>
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
        >
        </v-progress-circular>
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
    progressBar: false,
    selectedFile: null,
    editedItem: {
      store: "",
      logo_path_url: "",
    },
    defaultItem: {
      store: "",
      logo_path_url: "",
    },
    storeRules: [
      (v) => !!v || "Store Name is required",
      (v) => (v && v.length <= 100) || "Max 100 characters",
    ],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      setting: "setting/setting",
    }),
  },
  created() {
    this.go();
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setSetting: "setting/set",
    }),
    onFileSelected(event) {
      this.selectedFile = event;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.progressBar = true;
        let formData = new FormData();
        formData.set("store", this.editedItem.store);
        formData.set("logo", this.selectedFile);
        formData.set("user_id", this.user.id);
        formData.set("id", this.editedItem.id);
        let config = {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        };
        this.axios
          .post("/store-setting/store", formData, config)
          .then((response) => {
            let { data } = response;
            this.setAuth(data.data);
            this.setAlert({
              status: true,
              text: data.message,
              color: "success",
            });
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
    clear() {
      this.progressBar = false;
      window.location.reload();
    },
    reset() {
      this.$refs.fileLogo.reset();
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
