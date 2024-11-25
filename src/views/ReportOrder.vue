<template>
  <v-app>
    <SideBarAdmin />
    <div>
      <body>
        <div id="InvPckPrint">
          <h1>Invoice</h1>
          <article>
            <table
              class="inventory"
              v-scroll:#scroll-target="onScroll"
              ref="vDataTable"
            >
              <thead>
                <tr>
                  <th><span contenteditable>No</span></th>
                  <th><span contenteditable>Name</span></th>
                  <th><span contenteditable>Price</span></th>
                  <th><span contenteditable>Quantity</span></th>
                  <th><span contenteditable>Total</span></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in product_order"
                  :key="'product_order' + index"
                >
                  <td>
                    <span contenteditable>{{ index + 1 }}</span>
                  </td>
                  <td>
                    <span contenteditable>{{ item.name_product }}</span>
                  </td>
                  <td>
                    <span data-prefix>{{ item.price_product }} </span>
                  </td>
                  <td>
                    <span contenteditable>{{ item.quantity }}</span>
                  </td>
                  <td>
                    <span data-prefix>{{
                      item.quantity * item.price_product
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="balance">
              <tr>
                <th><span contenteditable>Total Bill</span></th>
                <td>
                  <span data-prefix>Rp </span
                  ><span>{{ orders.total_bill }}</span>
                </td>
              </tr>
            </table>
          </article>
        </div>
        <v-col cols="bg" class="text-center">
          <v-btn color="#1b5e20" class="white--text" @click="printInvoice">
            <v-icon>mdi-printer </v-icon>
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
      orderId: "",
      orders: "",
      product_order: [],
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
    getNow: function () {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      this.timestamp = dateTime;
    },
    printInvoice() {
      let divToPrint = document.getElementById("InvPckPrint");
      let htmlToPrint =
        '<style type="text/css">' +
        "	* {	" +
        "	    border: 0;	" +
        "	    box-sizing: content-box;	" +
        "	    color: inherit;	" +
        "	    font-family: inherit;	" +
        "	    font-size: inherit;	" +
        "	    font-style: inherit;	" +
        "	    font-weight: inherit;	" +
        "	    line-height: inherit;	" +
        "	    list-style: none;	" +
        "	    margin: 0;	" +
        "	    padding: 0;	" +
        "	    text-decoration: none;	" +
        "	    vertical-align: top;	" +
        "	}	" +
        "	*[contenteditable] {	" +
        "	    border-radius: 0.25em;	" +
        "	    min-width: 1em;	" +
        "	    outline: 0;	" +
        "	}	" +
        "	*[contenteditable] {	" +
        "	    cursor: pointer;	" +
        "	}	" +
        "	*[contenteditable]:hover,	" +
        "	*[contenteditable]:focus,	" +
        "	td:hover *[contenteditable],	" +
        "	td:focus *[contenteditable],	" +
        "	img.hover {	" +
        "	    background: #DEF;	" +
        "	    box-shadow: 0 0 1em 0.5em #DEF;	" +
        "	}	" +
        "	span[contenteditable] {	" +
        "	    display: inline-block;	" +
        "	}	" +
        "	h1 {	" +
        "	    font: bold 100% sans-serif;	" +
        "	    letter-spacing: 0.5em;	" +
        "	    text-align: center;	" +
        "	    text-transform: uppercase;	" +
        "	}	" +
        "	table {	" +
        "	    font-size: 100%;	" +
        "	    table-layout: fixed;	" +
        "	    width: 100%;	" +
        "	}	" +
        "	table {	" +
        "	    border-collapse: separate;	" +
        "	    border-spacing: 2px;	" +
        "	}	" +
        "	th,	" +
        "	td {	" +
        "	    border-width: 1px;	" +
        "	    padding: 0.5em;	" +
        "	    position: relative;	" +
        "	    text-align: left;	" +
        "	}	" +
        "	th,	" +
        "	td {	" +
        "	    border-radius: 0.25em;	" +
        "	    border-style: solid;	" +
        "	}	" +
        "		" +
        "	th {	" +
        "	    background: #EEE;	" +
        "	    border-color: #BBB;	" +
        "	}	" +
        "		" +
        "	td {	" +
        "	    border-color: #DDD;	" +
        "	}	" +
        "	html {	" +
        '	    font: 16px/1 "Open Sans", sans-serif;	' +
        "	    overflow: auto;	" +
        "	    padding: 0.5in;	" +
        "	}	" +
        "		" +
        "	html {	" +
        "	    background: #999;	" +
        "	    cursor: default;	" +
        "	}	" +
        "		" +
        "	body {	" +
        "	    box-sizing: border-box;	" +
        "	    height: 100%;	" +
        "	    margin: 0 auto;	" +
        "	    overflow: hidden;	" +
        "	    padding: 0.5in;	" +
        "	    width: 100%;	" +
        "	}	" +
        "		" +
        "	body {	" +
        "	    background: #FFF;	" +
        "	    border-radius: 1px;	" +
        "	    box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);	" +
        "	}	" +
        "		" +
        "	/* header */	" +
        "		" +
        "	header {	" +
        "	    margin: 0 0 0;	" +
        "	}	" +
        "		" +
        "	header:after {	" +
        "	    clear: both;	" +
        '	    content: "";	' +
        "	    display: table;	" +
        "	}	" +
        "		" +
        "	header h1 {	" +
        "	    background: #000;	" +
        "	    border-radius: 0.25em;	" +
        "	    color: #FFF;	" +
        "	    margin: 0 0 1em;	" +
        "	    padding: 0.5em 0;	" +
        "	}	" +
        "		" +
        "	header address {	" +
        "	    float: left;	" +
        "	    font-size: 100%;	" +
        "	    font-style: normal;	" +
        "	    line-height: 1.25;	" +
        "	    margin: 0 1em 1em 0;	" +
        "	}	" +
        "		" +
        "	header address p {	" +
        "	    margin: 0 0 0.25em;	" +
        "	}	" +
        "		" +
        "	header span,	" +
        "	header img {	" +
        "	    display: block;	" +
        "	    float: right;	" +
        "	}	" +
        "		" +
        "	header span {	" +
        "	    margin: 0 0 1em 1em;	" +
        "	    max-height: 100%;	" +
        "	    max-width: 100%;	" +
        "	    position: relative;	" +
        "	}	" +
        "		" +
        "	header img {	" +
        "	    max-height: 100%;	" +
        "	    max-width: 100%;	" +
        "	}	" +
        "		" +
        "	header input {	" +
        "	    cursor: pointer;	" +
        '	    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";	' +
        "	    height: 100%;	" +
        "	    left: 0;	" +
        "	    opacity: 0;	" +
        "	    position: absolute;	" +
        "	    top: 0;	" +
        "	    width: 100%;	" +
        "	}	" +
        "		" +
        "	/* article */	" +
        "		" +
        "	article,	" +
        "	article address,	" +
        "	table.meta,	" +
        "	table.inventory {	" +
        "	    margin: 0 0 0em;	" +
        "	}	" +
        "		" +
        "	article:after {	" +
        "	    clear: both;	" +
        '	    content: "";	' +
        "	    display: table;	" +
        "	}	" +
        "		" +
        "	article h1 {	" +
        "	    clip: rect(0 0 0 0);	" +
        "	    position: absolute;	" +
        "	}	" +
        "		" +
        "	article address {	" +
        "	    float: left;	" +
        "	    font-size: 125%;	" +
        "	    font-weight: bold;	" +
        "	}	" +
        "		" +
        "	/* table meta & balance */	" +
        "		" +
        "	table.meta,	" +
        "	table.balance {	" +
        "	    float: right;	" +
        "	    width: 50%;	" +
        "	}	" +
        "		" +
        "	table.meta:after,	" +
        "	table.balance:after {	" +
        "	    clear: both;	" +
        '	    content: "";	' +
        "	    display: table;	" +
        "	}	" +
        "		" +
        "	/* table meta */	" +
        "		" +
        "	table.meta th {	" +
        "	    width: 40%;	" +
        "	}	" +
        "		" +
        "	table.meta td {	" +
        "	    width: 60%;	" +
        "	}	" +
        "		" +
        "	/* table items */	" +
        "		" +
        "	table.inventory {	" +
        "	    clear: both;	" +
        "	    width: 100%;	" +
        "	}	" +
        "		" +
        "	table.inventory th {	" +
        "	    font-weight: bold;	" +
        "	    text-align: center;	" +
        "	}	" +
        "		" +
        "	table.inventory td:nth-child(1) {	" +
        "	    width: 26%;	" +
        "	}	" +
        "		" +
        "	table.inventory td:nth-child(2) {	" +
        "	    width: 38%;	" +
        "	}	" +
        "		" +
        "	table.inventory td:nth-child(3) {	" +
        "	    text-align: right;	" +
        "	    width: 12%;	" +
        "	}	" +
        "		" +
        "	table.inventory td:nth-child(4) {	" +
        "	    text-align: right;	" +
        "	    width: 12%;	" +
        "	}	" +
        "		" +
        "	table.inventory td:nth-child(5) {	" +
        "	    text-align: right;	" +
        "	    width: 12%;	" +
        "	}	" +
        "	table.balance th,	" +
        "	table.balance td {	" +
        "	    width: 50%;	" +
        "	}	" +
        "	table.balance td {	" +
        "	    text-align: right;	" +
        "	}	" +
        "	aside h1 {	" +
        "	    border: none;	" +
        "	    border-width: 0 0 1px;	" +
        "	    margin: 0 0 1em;	" +
        "	}	" +
        "	aside h1 {	" +
        "	    border-color: #999;	" +
        "	    border-bottom-style: solid;	" +
        "	}	" +
        "	.add,	" +
        "	.cut {	" +
        "	    border-width: 1px;	" +
        "	    display: block;	" +
        "	    font-size: .8rem;	" +
        "	    padding: 0.25em 0.5em;	" +
        "	    float: left;	" +
        "	    text-align: center;	" +
        "	    width: 0.6em;	" +
        "	}	" +
        "	.add,	" +
        "	.cut {	" +
        "	    background: #9AF;	" +
        "	    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);	" +
        "	    background-image: -moz-linear-gradient(#00ADEE 5%, #0078A5 100%);	" +
        "	    background-image: -webkit-linear-gradient(#00ADEE 5%, #0078A5 100%);	" +
        "	    border-radius: 0.5em;	" +
        "	    border-color: #0076A3;	" +
        "	    color: #FFF;	" +
        "	    cursor: pointer;	" +
        "	    font-weight: bold;	" +
        "	    text-shadow: 0 -1px 2px rgba(0, 0, 0, 0.333);	" +
        "	}	" +
        "	.add {	" +
        "	    margin: -2.5em 0 0;	" +
        "	}	" +
        "	.add:hover {	" +
        "	    background: #00ADEE;	" +
        "	}	" +
        "	.cut {	" +
        "	    opacity: 0;	" +
        "	    position: absolute;	" +
        "	    top: 0;	" +
        "	    left: -1.5em;	" +
        "	}	" +
        "	.cut {	" +
        "	    -webkit-transition: opacity 100ms ease-in;	" +
        "	}	" +
        "	tr:hover .cut {	" +
        "	    opacity: 1;	" +
        "	}	" +
        "	@media print {	" +
        "	    * {	" +
        "	        -webkit-print-color-adjust: exact;	" +
        "	    }	" +
        "		" +
        "	    html {	" +
        "	        background: none;	" +
        "	        padding: 0;	" +
        "	    }	" +
        "		" +
        "	    body {	" +
        "	        box-shadow: none;	" +
        "	        margin: 0;	" +
        "	    }	" +
        "		" +
        "	    span:empty {	" +
        "	        display: none;	" +
        "	    }	" +
        "		" +
        "	    .add,	" +
        "	    .cut {	" +
        "	        display: none;	" +
        "	    }	" +
        "	}	" +
        "	@page {	" +
        "	    margin: 0;	" +
        "	}	" +
        "</style>";
      htmlToPrint += divToPrint.outerHTML;
      let windowToPrint = window.open("");
      windowToPrint.document.write(htmlToPrint);
      windowToPrint.print();
      windowToPrint.close();
    },
    go() {
      this.courier = 0;
      let formData = new FormData();
      formData.set("id", this.orderId);
      let config = {
        headers: {
          Authorization: "Bearer " + this.user.api_token,
        },
      };
      let url = "/orders/report-order";
      this.axios
        .post(url, formData, config)
        .then((response) => {
          let { data } = response.data;
          this.orders = data;
          this.product_order = response.data.product_order;
        })
        .catch((error) => {
          let { responses } = error;
          console.log(responses);
        });
    },
  },
  created() {
    this.orderId = this.$route.params.id;
    this.go();
  },
};
</script>
<style scoped>
/* reset */

* {
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

/* content editable */

*[contenteditable] {
  border-radius: 0.25em;
  min-width: 1em;
  outline: 0;
}

*[contenteditable] {
  cursor: pointer;
}

*[contenteditable]:hover,
*[contenteditable]:focus,
td:hover *[contenteditable],
td:focus *[contenteditable],
img.hover {
  background: #def;
  box-shadow: 0 0 1em 0.5em #def;
}

span[contenteditable] {
  display: inline-block;
}

/* heading */

h1 {
  font: bold 100% sans-serif;
  letter-spacing: 0.5em;
  text-align: center;
  text-transform: uppercase;
}

/* table */

table {
  font-size: 75%;
  table-layout: fixed;
  width: 100%;
}

table {
  border-collapse: separate;
  border-spacing: 2px;
}

th,
td {
  border-width: 1px;
  padding: 0.5em;
  position: relative;
  text-align: left;
}

th,
td {
  border-radius: 0.25em;
  border-style: solid;
}

th {
  background: #eee;
  border-color: #bbb;
}

td {
  border-color: #ddd;
}

/* page */

html {
  font: 16px/1 "Open Sans", sans-serif;
  overflow: auto;
  padding: 0.5in;
}

html {
  background: #999;
  cursor: default;
}

body {
  box-sizing: border-box;
  height: 11in;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5in;
  width: 8.5in;
}

body {
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
}

/* header */

header {
  margin: 0 0 3em;
}

header:after {
  clear: both;
  content: "";
  display: table;
}

header h1 {
  background: #000;
  border-radius: 0.25em;
  color: #fff;
  margin: 0 0 1em;
  padding: 0.5em 0;
}

header address {
  float: left;
  font-size: 75%;
  font-style: normal;
  line-height: 1.25;
  margin: 0 1em 1em 0;
}

header address p {
  margin: 0 0 0.25em;
}

header span,
header img {
  display: block;
  float: right;
}

header span {
  margin: 0 0 1em 1em;
  max-height: 25%;
  max-width: 60%;
  position: relative;
}

header img {
  max-height: 100%;
  max-width: 100%;
}

header input {
  cursor: pointer;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

/* article */

article,
article address,
table.meta,
table.inventory {
  margin: 0 0 0em;
}

article:after {
  clear: both;
  content: "";
  display: table;
}

article h1 {
  clip: rect(0 0 0 0);
  position: absolute;
}

article address {
  float: left;
  font-size: 125%;
  font-weight: bold;
}

/* table meta & balance */

table.meta,
table.balance {
  float: right;
  width: 50%;
}

table.meta:after,
table.balance:after {
  clear: both;
  content: "";
  display: table;
}

/* table meta */

table.meta th {
  width: 40%;
}

table.meta td {
  width: 60%;
}

/* table items */

table.inventory {
  clear: both;
  width: 100%;
}

table.inventory th {
  font-weight: bold;
  text-align: center;
}

table.inventory td:nth-child(1) {
  width: 26%;
}

table.inventory td:nth-child(2) {
  width: 38%;
}

table.inventory td:nth-child(3) {
  text-align: right;
  width: 12%;
}

table.inventory td:nth-child(4) {
  text-align: right;
  width: 12%;
}

table.inventory td:nth-child(5) {
  text-align: right;
  width: 12%;
}

/* table balance */

table.balance th,
table.balance td {
  width: 50%;
}

table.balance td {
  text-align: right;
}

/* aside */

aside h1 {
  border: none;
  border-width: 0 0 1px;
  margin: 0 0 1em;
}

aside h1 {
  border-color: #999;
  border-bottom-style: solid;
}

/* javascript */

.add,
.cut {
  border-width: 1px;
  display: block;
  font-size: 0.8rem;
  padding: 0.25em 0.5em;
  float: left;
  text-align: center;
  width: 0.6em;
}

.add,
.cut {
  background: #9af;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background-image: -moz-linear-gradient(#00adee 5%, #0078a5 100%);
  background-image: -webkit-linear-gradient(#00adee 5%, #0078a5 100%);
  border-radius: 0.5em;
  border-color: #0076a3;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  text-shadow: 0 -1px 2px rgba(0, 0, 0, 0.333);
}

.add {
  margin: -2.5em 0 0;
}

.add:hover {
  background: #00adee;
}

.cut {
  opacity: 0;
  position: absolute;
  top: 0;
  left: -1.5em;
}

.cut {
  -webkit-transition: opacity 100ms ease-in;
}

tr:hover .cut {
  opacity: 1;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
  }

  html {
    background: none;
    padding: 0;
  }

  body {
    box-shadow: none;
    margin: 0;
  }

  span:empty {
    display: none;
  }

  .add,
  .cut {
    display: none;
  }
}

@page {
  margin: 0;
}
</style>
