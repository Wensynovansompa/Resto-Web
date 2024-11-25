<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <body>
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
              <v-textarea v-model="editedItem.store" disabled></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <div id="InvPckPrint">
          <h1>Payment : {{ image_download }}</h1>
          <br />
          <center>
            <img :src="getImage('/' + url)" height="500px" width="500px" />
          </center>
        </div>

        <br />
        <v-col cols="bg" class="text-center">
          <v-btn color="#1b5e20" class="white--text" @click="printInvoice">
            <v-icon>mdi-printer</v-icon>
            PRINT
          </v-btn>
        </v-col>
      </body>
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
      editedItem: {}, // Objek yang menyimpan data toko
      orderId: "",
      url: "",
      image_download: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      setting: "setting/setting",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setSetting: "setting/set",
    }),
    getNow() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      return date + " " + time;
    },
    printInvoice() {
      let divToPrint = document.getElementById("InvPckPrint");
      let htmlToPrint =
        '<style type="text/css"> /* CSS styling code here */ </style>';
      htmlToPrint += divToPrint.outerHTML;
      let windowToPrint = window.open("");
      windowToPrint.document.write(htmlToPrint);
      windowToPrint.print();
      windowToPrint.close();
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
          console.error(error);
        });
    },
  },
  created() {
    this.go();
  },
};
</script>
