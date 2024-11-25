<template>
  <v-card :height="height">
    <v-app>
      <v-main>
        <alert />
        <router-view />
      </v-main>
    </v-app>
  </v-card>
</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.2.4/jspdf.plugin.autotable.min.js"></script>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    Alert: () =>
      import(/* webpackChunkName: "alert" */ "@/components/Alert.vue"),
  },
  data: () => ({
    //
  }),
  methods: {
    ...mapActions({
      setDialogStatus: "dialog/setStatus",
      setDialogComponent: "dialog/setComponent",
      setAuth: "auth/set",
      setAlert: "alert/set",
      setSetting: "setting/set",
    }),
  },

  computed: {
    ...mapGetters({
      guest: "auth/guest",
      user: "auth/user",
      dialogStatus: "dialog/status",
      currentComponent: "dialog/component",
      setting: "setting/setting",
      height() {
        switch (this.$vuetify.breakpoint.name) {
          case "xs":
            return 220;
          case "sm":
            return 400;
          case "md":
            return 500;
          case "lg":
            return 600;
          case "xl":
            return 800;
        }
      },
    }),
    dialog: {
      get() {
        return this.dialogStatus;
      },
      set(value) {
        this.setDialogStatus(value);
      },
    },
  },
};
</script>
