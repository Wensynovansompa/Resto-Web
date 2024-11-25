<template>
  <v-card class="mx-auto" @click="isConfirmation()">
    <v-row align="center" justify="center">
      <v-overlay color="White" :absolute="absolute" :value="progressBar">
        <div class="text-center">
          <v-progress-circular :size="70" :width="7" color="blue" indeterminate>
          </v-progress-circular>
        </div>
      </v-overlay>
    </v-row>
    <center>
      <v-img src="img/CafeTable.png" class="grey lighten-2" aspect-ratio="1" />
    </center>
    <v-card-text
      length="10"
      style="height: 100px; overflow: hidden; color: black"
      class="hidden-sm-and-down"
    >
      <tr>
        <td>Tipe:</td>
        <td>{{ chair.name }}</td>
      </tr>
      <tr>
        <td>No:</td>
        <td>{{ chair.no }}</td>
      </tr></v-card-text
    >

    <div class="text-center">
      <v-dialog v-model="dialogCheckout" hide-overlay max-width="30%" max-height="30%">
        <v-card>
          <v-img src="img/CafeTable.png" class="red--text" />
          <v-card-text class="hidden-sm-and-down">
            <v-simple-table dense>
              <tbody>
                <tr>
                  <td>Tipe:</td>
                  <td>{{ chair.name }}</td>
                </tr>
                <tr>
                  <td>No:</td>
                  <td>{{ chair.no }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="#1b5e20"
              :disabled="chair.status == 'terpakai'"
              @click="buy"
              class="white--text"
            >
              <v-icon color="white">mdi-check-circle</v-icon>
              Choose
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "chair-item",
  props: ["chair"],
  data: () => ({
    dialogCheckout: false,
    chair: {},
    progressBar: false,
  }),
  computed: {
    ...mapGetters({
      carts: "cart/carts",
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      addCart: "cart/add",
      setAlert: "alert/set",
      setChairName: "chair/setName",
      setChairId: "chair/setId",
    }),
    isConfirmation() {
      this.dialogCheckout = true;
    },
    buy() {
      this.setChairName(this.chair.name);
      this.setChairId(this.chair.id);
      this.setAlert({
        status: true,
        color: "success",
        text: "Added to cart",
      });
      this.dialogCheckout = false;
    },
  },
};
</script>
