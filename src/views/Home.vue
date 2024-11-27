<template>
  <div class="home">
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
    <br />
    <br />
    <br />
    <v-container style="width: 50%">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10">
          <v-card class="elevation-6 mt-10">
            <v-window v-model="step">
              <v-window-item :value="1">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-card-text class="mt-12">
                      <h4 class="text-center">Login</h4>
                      <v-row align="center" justify="center">
                        <v-col cols="12" sm="8">
                          <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                label="Username"
                                :counter="50"
                                required
                                append-icon="mdi-email"
                              >
                              </v-text-field>
                              <v-text-field
                                v-model="password"
                                :append-icon="
                                  showPassword ? 'mdi-eye' : 'mdi-eye-off'
                                "
                                :rules="passwordRules"
                                :type="showPassword ? 'text' : 'password'"
                                label="Password"
                                hint="At least 6 characters"
                                counter
                                @click:append="showPassword = !showPassword"
                              ></v-text-field>
                              <v-row>
                                <v-col cols="12" sm="7">
                                  <a class="black--text" @click="forgotPassword"
                                    >Lupa Password</a
                                  >
                                </v-col>
                              </v-row>
                              <br />

                              <div class="text-xs-center">
                                <v-row>
                                  <v-col cols="12" md="6">
                                    <v-btn
                                      style="float: left"
                                      color="#1b5e20"
                                      :disabled="!valid"
                                      @click="login"
                                      onloadstart="loading"
                                      class="white--text"
                                    >
                                      Login
                                    </v-btn>
                                  </v-col>
                                  <v-col cols="12" sm="6">
                                    <v-btn
                                      style="float: right"
                                      color="#1b5e20"
                                      @click="step++"
                                      class="white--text"
                                      >SIGN UP</v-btn
                                    >
                                  </v-col>
                                </v-row>
                              </div>
                            </v-form>
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
              <v-window-item :value="2">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-card-text class="mt-12">
                      <h4 class="text-center">Sign Up untuk membuat akun</h4>

                      <v-row align="center" justify="center">
                        <v-col cols="12" sm="8">
                          <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field
                              v-model="name"
                              :rules="nameRules"
                              :counter="50"
                              label="Nama"
                              required
                              append-icon="mdi-user"
                            ></v-text-field>
                            <v-text-field
                              v-model="email"
                              :rules="emailRules"
                              label="E-mail"
                              required
                              append-icon="mdi-email"
                            >
                            </v-text-field>
                            <v-text-field
                              v-model="password"
                              :append-icon="
                                showPassword ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              :rules="passwordRules"
                              :type="showPassword ? 'text' : 'password'"
                              label="Password"
                              hint="At least 6 characters"
                              counter
                              @click:append="showPassword = !showPassword"
                            >
                            </v-text-field>
                            <v-checkbox
                              v-model="checkbox"
                              :rules="[(v) => !!v || 'Checklist untuk lanjut!']"
                              label="Setuju dengan kebijakan privasi?"
                              required
                              color="#1B5E20"
                            ></v-checkbox>
                            <div class="text-xs-center">
                              <v-row>
                                <v-col cols="12" md="6">
                                  <v-btn
                                    color="#1B5E20"
                                    :disabled="!valid"
                                    @click="submit"
                                    class="white--text mr-4"
                                  >
                                    SIGN UP
                                  </v-btn>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-btn
                                    style="float: right"
                                    color="#1b5e20"
                                    @click="step--"
                                    class="white--text"
                                    >LOGIN
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </div>
                          </v-form>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <template>
      <v-layout row justify-center>
        <v-dialog
          v-model="dialogProsesed"
          persistent
          max-width="290"
          id="dialogProsesed"
        >
          <v-progress-linear indeterminate color="blue" height="30"
            ><span>Waits...</span></v-progress-linear
          >
        </v-dialog>
      </v-layout>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      valid: true,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) =>
          /([a-zA-Z0-9_]{1,})(@)([a-zA-Z0-9_]{2,}).([a-zA-Z0-9_]{2,})+/.test(
            v
          ) || "E-mail must be valid",
      ],
      showPassword: false,
      password: "",
      passwordRules: [
        (v) => !!v || "Password required.",
        (v) => (v && v.length >= 6) || "Min 6 characters",
      ],
      step: 1,
      checkbox: false,
      dialogProsesed: false,
    };
  },
  props: {
    source: String,
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
    forgotPassword() {
      return this.$router.push({ path: "/forgot-password" });
    },
    login() {
      if (this.$refs.form.validate()) {
        this.dialogProsesed = true;
        let formData = {
          email: this.email,
          password: this.password,
        };
        this.axios
          .post("/login", formData)
          .then((response) => {
            let { data } = response.data;
            this.setAuth(data);
            this.dialogProsesed = false;
            if (this.user.id > 0) {
              this.setAlert({
                status: true,
                color: "success",
                text: "Login success",
              });
              if (this.prevUrl.length > 0) this.$router.push(this.prevUrl); // tambahkan ini
              if ("CUSTOMER" == this.user.roles) {
                this.closeCustomer();
              } else {
                this.close();
              }
            } else {
              this.setAlert({
                status: true,
                color: "warning",
                text: "Login failed",
              });
            }
          })
          .catch((error) => {
            this.dialogProsesed = false;
            let { data } = error.response;
            this.setAlert({
              status: true,
              color: "error",
              text: data.message,
            });
          });
      }
    },
    close() {
      return this.$router.push({ path: "/admin" });
    },
    closeCustomer() {
      return this.$router.push({ path: "/admin-customer" });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.progressBar = true;
        let formData = new FormData();
        formData.set("name", this.name);
        formData.set("email", this.email);
        formData.set("password", this.password);
        this.axios
          .post("/register", formData)
          .then((response) => {
            let { data } = response.data;
            this.setAuth(data);
            this.setAlert({
              status: true,
              color: "success",
              text: "Register success",
            });
            this.isHome();
          })
          .catch((error) => {
            let { data } = error.response;
            this.setAlert({
              status: true,
              color: "error",
              text: data.message,
            });
          });

        this.progressBar = false;
      }
    },
    isHome() {
      this.step++;
      return this.$router.push({ path: "/" });
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

.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
</style>
