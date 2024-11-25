<template>
  <v-card>
    <v-toolbar dark color="#1b5e20">
      <v-toolbar-title>New Password</v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <v-container fluid>
      <v-form ref="form" v-model="valid" lazy-validation aria-autocomplete="off">
        <v-text-field
          v-model="email"
          type="email"
          id="email"
          :rules="emailRules"
          label="E-mail"
          required
          append-icon="mdi-email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Confirm Password"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>

        <div class="text-xs-center">
          <v-btn color="#1b5e20" @click="resetPassword" class="white--text">
            Reset Password
            <v-icon right class="white--text">mdi-content-save-move</v-icon>
          </v-btn>
        </div>
      </v-form>
    </v-container>
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
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      progressBar: false,
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      password: "",
      confirmPassword: "",
      email: "",
      token: null,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 6 || "Min 6 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      prevUrl: "prevUrl", // <= ini
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    resetPassword() {
      this.progressBar = true;
      let formData = {
        token: this.$route.params.token,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
      };
      this.axios
        .post("/reset/password", formData)
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            text: data.message,
            color: "success",
          });
          this.progressBar = false;
          this.$router.push("/");
        })
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
  },
};
</script>
