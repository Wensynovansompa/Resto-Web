<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <v-card>
        <v-card-text>
          <v-sheet max-width="100%" height="100%" class="mx-auto"></v-sheet>
          <v-subheader color="black"> Edit Profile </v-subheader>
          <br />
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field label="Name" v-model="name" required append-icon="mdi-user">
            </v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              hint="At least 6 characters"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-form>

          <v-card-actions>
            <v-btn color="#1b5e20" dark @click="saveProfile">
              <v-icon>mdi-content-save</v-icon> &nbsp; Save
            </v-btn>
          </v-card-actions>
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
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  data: () => ({
    valid: true,
    name: "",
    showPassword: false,
    password: "",
    passwordRules: [
      (v) => !!v || "Password required.",
      (v) => (v && v.length >= 6) || "Min 6 characters",
    ],
    rand: 1,
    progressBar: false,
  }),

  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),

    saveProfile() {
      this.progressBar = true;
      let formData = new FormData();
      formData.set("name", this.name);
      formData.set("password", this.password);

      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      this.axios
        .post("/profile", formData, config)
        .then((response) => {
          let { data } = response;
          this.setAuth(data.data);
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.progressBar = false;
        })
        .bind(this)
        .catch((error) => {
          let { data } = error;
          this.setAlert({
            status: true,
            text: data.message,
            color: "error",
          });
          this.progressBar = false;
        });
    },

    resetNow() {
      location.reload();
    },
  },

  created() {
    this.name = this.user.name;
    this.password = this.user.password;
  },
};
</script>
