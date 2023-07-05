<template>
    <div>
      <data-form v-if="isAllowed" :objectdata="objectData" :newurl="'/supplier/quotation/save'" :pagetitle="'edit'"
        :redirectedit="'EditQuotation'" :headertitle="'Quotation'" @saved="savedResponse"></data-form>
      <v-card v-else>
        <v-card-text>
            <h3 class="text-center">Incorrect path, kindly open the link from the Email that you received from GAG Procurement System notification.</h3>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  import DataForm from "./DataForm.vue";
  
  export default {
    components: { DataForm },
    data() {
      return {
        objectData: {},
        validation: {},
        isAllowed: false,
      };
    },
    methods: {
      getData() {
         
        if (!this.$route.query.id) {
          return false;
        }
         
        let queryString = JSON.parse(atob(this.$route.query.id)); 
        let value = queryString.split("&");
        let id = value[0];
        id = id.replace(/\D/g, ''); 
        let key = value[1].split("=");
        if (!key || key.length < 1) {
          return false;
        }
  
        this.isAllowed = true;
        this.validation = { id: id, key: key[1] };
         
        axios
          .get("/supplier/quotation/fetch-testing?id=" + this.$route.query.id)
          .then((response) => {
            this.objectData = Object.assign({}, response.data);
          })
          .catch((err) => { });
      },
      savedResponse() {
        this.getData();
      },
    },
    mounted() {
      this.getData();
    },
  };
  </script>