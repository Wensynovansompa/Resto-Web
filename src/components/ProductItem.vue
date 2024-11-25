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
    <v-img class="grey lighten-2" aspect-ratio="1" :src="getImage('/' + product.cover)">
    </v-img>
    <v-card-text
      length="10"
      style="height: 100px; overflow: hidden; color: black"
      class="hidden-sm-and-down"
    >
      {{ product.title }}</v-card-text
    >

    <div class="text-center">
      <v-dialog v-model="dialogCheckout" hide-overlay max-width="30%" max-height="30%">
        <v-card>
          <v-img :src="getImage('/' + product.cover)" class="red--text"> </v-img>
          <v-card-text class="hidden-sm-and-down">
            <v-simple-table dense>
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{{ product.title }}</td>
                </tr>
                <tr>
                  <td>Stock:</td>
                  <td>{{ product.stock }} item</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="#1b5e20"
              :disabled="product.stock == 0"
              @click="buy"
              class="white--text"
            >
              <v-icon color="white">mdi-cart-plus</v-icon>
              BUY
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
  name: "product-item",
  props: ["product"],
  data: () => ({
    dialogCheckout: false,
    product: {},
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
    }),
    isConfirmation() {
      this.dialogCheckout = true;
    },
    buy() {
      let formData = new FormData();
      formData.append("id", this.product.id);
      formData.append("title", this.product.title);
      formData.append("cover", this.product.cover);
      formData.append("price", this.product.price);
      formData.append("quantity", this.product.quantity);
      formData.append("stock", this.product.stock);
      this.addCart(formData);
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
